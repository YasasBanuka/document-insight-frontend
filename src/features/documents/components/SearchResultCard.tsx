import { FileText, Hash, TrendingUp, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { SearchResult } from '../../../types/api.types';

interface SearchResultCardProps {
  result: SearchResult;
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  const [copied, setCopied] = useState(false);
  const similarityPercent = (result.similarity * 100).toFixed(1);

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      toast.success('Content copied to clipboard', {
        icon: '📋',
        duration: 2000,
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">
            <FileText className="w-4 h-4 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">
              {result.filename}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                Chunk {result.chunk_index}
              </span>
              <span>{result.token_count} tokens</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Copy button */}
          <button
            onClick={handleCopyContent}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-100 rounded"
            aria-label="Copy content"
            data-tooltip-id="copy-tooltip"
            data-tooltip-content="Copy content"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            )}
          </button>

          {/* Similarity badge */}
          <div className="flex items-center gap-1 px-2 py-1 bg-primary-50 rounded-lg flex-shrink-0">
            <TrendingUp className="w-3 h-3 text-primary-600" />
            <span className="text-xs font-medium text-primary-700">
              {similarityPercent}%
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg line-clamp-3">
        {result.content}
      </p>
    </motion.div>
  );
}