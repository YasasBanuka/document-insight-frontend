import { FileText, Hash, Copy, Info, Eye, Trash2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { DocumentPreview } from '../../../components/ui/DocumentPreview';
import type { Document } from '../../../types/api.types';

interface DocumentCardProps {
  document: Document;
  onDelete: (id: number) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileTypeInfo = () => {
    if (document.contentType.includes('pdf')) {
      return { icon: FileText, color: 'text-red-600', bg: 'bg-red-50' };
    }
    if (document.contentType.includes('word')) {
      return { icon: FileText, color: 'text-primary-600', bg: 'bg-primary-50' };
    }
    return { icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50' };
  };

  const handleCopyFilename = async () => {
    try {
      await navigator.clipboard.writeText(document.filename);
      toast.success('Filename copied', { duration: 2000 });
    } catch (error) {
      toast.error('Failed to copy filename');
    }
  };

  const handleShowDetails = () => {
    toast.custom(
      (t) => (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-6 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Document Details</h3>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-slate-500">Filename:</span>
              <p className="font-medium text-slate-900 break-words">{document.filename}</p>
            </div>
            <div>
              <span className="text-slate-500">Size:</span>
              <p className="font-medium text-slate-900">{formatFileSize(document.fileSize)}</p>
            </div>
            <div>
              <span className="text-slate-500">Type:</span>
              <p className="font-medium text-slate-900">{document.contentType}</p>
            </div>
            <div>
              <span className="text-slate-500">Uploaded:</span>
              <p className="font-medium text-slate-900">{formatDate(document.uploadedAt)}</p>
            </div>
            {document.chunkCount && (
              <div>
                <span className="text-slate-500">Chunks:</span>
                <p className="font-medium text-slate-900">{document.chunkCount} processed chunks</p>
              </div>
            )}
            <div>
              <span className="text-slate-500">ID:</span>
              <p className="font-medium text-slate-900 font-mono text-xs">{document.id}</p>
            </div>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const fileType = getFileTypeInfo();
  const FileIcon = fileType.icon;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-slate-200 group"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 flex items-start gap-3">
            <div className={`p-2 ${fileType.bg} rounded-lg flex-shrink-0`}>
              <FileIcon className={`w-5 h-5 ${fileType.color}`} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">
                {document.filename}
              </h3>
              <p className="text-sm text-slate-500">
                {formatFileSize(document.fileSize)}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(document.uploadedAt)}
                </span>
                {document.chunkCount && (
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {document.chunkCount} chunks
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions Menu - Always visible on mobile, hover-only on desktop */}
          <div className="ml-4 flex items-center gap-1">
            {/* Action buttons - responsive visibility */}
            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setShowPreview(true)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation"
                aria-label="Preview document"
                data-tooltip-id="doc-tooltip"
                data-tooltip-content="Preview document"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopyFilename}
                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all touch-manipulation"
                aria-label="Copy filename"
                data-tooltip-id="doc-tooltip"
                data-tooltip-content="Copy filename"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={handleShowDetails}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation"
                aria-label="View details"
                data-tooltip-id="doc-tooltip"
                data-tooltip-content="View details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Delete button (always visible) */}
            <button
              onClick={() => onDelete(document.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all touch-manipulation"
              aria-label="Delete document"
              data-tooltip-id="doc-tooltip"
              data-tooltip-content="Delete document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Document Preview Modal */}
      {showPreview && (
        <DocumentPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          document={document}
        />
      )}
    </>
  );
}