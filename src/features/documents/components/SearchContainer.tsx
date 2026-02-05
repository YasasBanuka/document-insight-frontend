import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Search, Loader2, ChevronLeft, ChevronRight, X, History, Clock } from 'lucide-react';
import { documentApi } from '../api/documentApi';
import { SearchResultCard } from './SearchResultCard';
import { SearchResultSkeleton } from '../../../components/ui/Skeleton';
import React from 'react';

const MAX_HISTORY = 10;

export function SearchContainer() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const pageSize = 5;

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('docura-search-history');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load search history');
      }
    }
  }, []);

  // Save search history to localStorage
  const saveToHistory = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setSearchHistory(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(item => item !== trimmed);
      // Add to beginning
      const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem('docura-search-history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('docura-search-history');
    toast.success('Search history cleared');
    setShowHistory(false);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['search', searchQuery, page],
    queryFn: () => documentApi.searchDocuments(searchQuery, page, pageSize),
    enabled: !!searchQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
      setPage(0);
      saveToHistory(query);
      setShowHistory(false);

      // Loading toast
      toast.loading('Searching documents...', {
        id: 'search-loading',
      });
    }
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
    setSearchQuery(term);
    setPage(0);
    setShowHistory(false);

    toast.loading('Searching documents...', {
      id: 'search-loading',
    });
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchQuery('');
    setPage(0);
  };

  // Dismiss loading toast when search completes
  React.useEffect(() => {
    if (data || isError) {
      toast.dismiss('search-loading');

      if (data) {
        toast.success(
          `Found ${data.totalElements} result${data.totalElements !== 1 ? 's' : ''}`,
          {
            duration: 3000,
          }
        );
      }
    }
  }, [data, isError]);

  // Show error toast
  React.useEffect(() => {
    if (isError) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Search failed. Please try again.';

      toast.error(errorMessage, {
        duration: 5000,
      });
    }
  }, [isError, error]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Search className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Search Documents</h2>
            <p className="text-sm text-slate-500">Find specific content across all your documents</p>
          </div>
        </div>

        {/* Search History Button */}
        {searchHistory.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            data-tooltip-id="doc-tooltip"
            data-tooltip-content="Search history"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </button>
        )}
      </div>

      {/* Search History Panel */}
      {showHistory && searchHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Clock className="w-4 h-4" />
              Recent Searches
            </div>
            <button
              onClick={clearHistory}
              className="text-xs text-slate-500 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-1">
            {searchHistory.map((term, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(term)}
                className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-primary-600 rounded transition-all flex items-center gap-2"
              >
                <Search className="w-3 h-3" />
                {term}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowHistory(searchHistory.length > 0 && !query)}
              placeholder="Enter search keywords..."
              aria-label="Search input"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 placeholder-slate-400"
            />
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!query.trim()}
            className="px-6 py-2.5 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-primary-500/30"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </form>

      {/* Loading State with Skeletons */}
      {isLoading && (
        <div className="space-y-3">
          <SearchResultSkeleton />
          <SearchResultSkeleton />
          <SearchResultSkeleton />
        </div>
      )}

      {/* Results */}
      {data && !isLoading && (
        <>
          {/* Results Header */}
          {searchQuery && (
            <div className="mb-4 pb-3 border-b border-slate-200">
              <p className="text-sm text-slate-600">
                Found <strong className="text-slate-900">{data.totalElements}</strong> result{data.totalElements !== 1 ? 's' : ''}
                <span className="text-slate-400"> for "{searchQuery}"</span>
              </p>
            </div>
          )}

          {/* Results List */}
          {data.content.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="p-4 bg-slate-100 rounded-full inline-block mb-3">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="font-medium text-slate-700 mb-1">No results found</p>
              <p className="text-sm text-slate-500">Try different keywords or check your spelling</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {data.content.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination Controls */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Previous page"
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-sm text-slate-600 font-medium">
                Page {page + 1} of {data.totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
                disabled={page >= data.totalPages - 1}
                aria-label="Next page"
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}