import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { documentApi } from '../api/documentApi';
import { SearchResultCard } from './SearchResultCard';

export function SearchContainer() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', searchQuery, page],
    queryFn: () => documentApi.searchDocuments(searchQuery, page, pageSize),
    enabled: !!searchQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
      setPage(0);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Search className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Search Documents</h2>
          <p className="text-sm text-slate-500">Find specific content across all your documents</p>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search keywords..."
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary-500/30"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          <span className="ml-3 text-slate-600">Searching...</span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Search failed</p>
          <p className="text-sm mt-1">Please try again</p>
        </div>
      )}

      {/* Results */}
      {data && (
        <>
          {/* Results Header */}
          <div className="mb-4 pb-3 border-b border-slate-200">
            <p className="text-sm text-slate-600">
              Found <strong className="text-slate-900">{data.totalElements}</strong> result{data.totalElements !== 1 ? 's' : ''}
              {searchQuery && <span className="text-slate-400"> for "{searchQuery}"</span>}
            </p>
          </div>

          {/* Results List */}
          {data.content.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-slate-500"
            >
              <div className="p-4 bg-slate-100 rounded-full inline-block mb-3">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="font-medium">No results found</p>
              <p className="text-sm mt-1">Try different keywords</p>
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