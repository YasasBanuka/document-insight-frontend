import { useState, useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document as PDFDocument, Page as PDFPage, pdfjs } from 'react-pdf';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { documentApi } from '../../features/documents/api/documentApi';
import { BRAND } from '../../constants/branding';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentPreviewProps {
    isOpen: boolean;
    onClose: () => void;
    document: {
        id: number;
        filename: string;
        contentType: string;
        fileSize: number;
        uploadedAt: string;
        chunkCount?: number;
    };
}

export function DocumentPreview({ isOpen, onClose, document: doc }: DocumentPreviewProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get professional icon based on file type
    const getFileIcon = () => {
        const { Icon, colorClass, bgClass } = BRAND.getFileTypeIcon(doc.contentType);
        return (
            <div className={`p-2 ${bgClass} rounded-lg`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
        );
    };

    const isPDF = document.contentType.includes('pdf');
    const isDocx = document.contentType.includes('word') || document.contentType.includes('document');
    const isText = document.contentType.includes('text');

    // Fetch document content
    const { data: contentBlob, isLoading: isLoadingPDF } = useQuery({
        queryKey: ['document-content', doc.id],
        queryFn: () => documentApi.getDocumentContent(doc.id),
        enabled: isOpen && isPDF,
        staleTime: Infinity, // Don't refetch unless manually invalidated
    });

    // Fetch text preview for DOCX/TXT
    const { data: textContent, isLoading: isLoadingText } = useQuery({
        queryKey: ['document-preview', doc.id],
        queryFn: () => documentApi.getDocumentPreview(doc.id),
        enabled: isOpen && (isDocx || isText),
        staleTime: Infinity,
    });

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        if (contentBlob) {
            const url = URL.createObjectURL(contentBlob);
            setPdfUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [contentBlob]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        toast.success(`Successfully loaded ${numPages} page${numPages > 1 ? 's' : ''}`, {
            duration: 2000,
        });
    };

    const onDocumentLoadError = (error: Error) => {
        toast.error(`Failed to load PDF: ${error.message}`);
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3.0));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
    const handlePreviousPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));

    const handleDownload = () => {
        if (pdfUrl) {
            const a = document.createElement('a');
            a.href = pdfUrl;
            a.download = doc.filename;
            a.click();
            toast.success('Download started');
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePreviousPage();
            if (e.key === 'ArrowRight') handleNextPage();
            if (e.key === '+' || e.key === '=') handleZoomIn();
            if (e.key === '-' || e.key === '_') handleZoomOut();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, pageNumber, numPages]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex-shrink-0">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {getFileIcon()}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-slate-900 truncate">
                                    {doc.filename}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    {formatFileSize(doc.fileSize)} • {formatDate(doc.uploadedAt)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isPDF && pdfUrl && (
                                <button
                                    onClick={handleDownload}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors touch-manipulation"
                                    aria-label="Download document"
                                    data-tooltip-id="doc-tooltip"
                                    data-tooltip-content="Download"
                                >
                                    <Download className="w-5 h-5 text-slate-600" />
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors touch-manipulation"
                                aria-label="Close preview"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* PDF Controls */}
                    {isPDF && pdfUrl && (
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleZoomOut}
                                    disabled={scale <= 0.5}
                                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label="Zoom out"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-medium text-slate-700 min-w-[60px] text-center">
                                    {Math.round(scale * 100)}%
                                </span>
                                <button
                                    onClick={handleZoomIn}
                                    disabled={scale >= 3.0}
                                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label="Zoom in"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                            </div>

                            {numPages && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={pageNumber <= 1}
                                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm font-medium text-slate-700 min-w-[80px] text-center">
                                        Page {pageNumber} of {numPages}
                                    </span>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={pageNumber >= numPages}
                                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
                                        aria-label="Next page"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div className="text-xs text-slate-500">
                                ← → arrows • +/- zoom • ESC close
                            </div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="flex-1 overflow-auto bg-slate-100 p-4">
                        {/* PDF Preview */}
                        {isPDF && (
                            <div className="flex justify-center">
                                {isLoadingPDF ? (
                                    <div className="flex items-center gap-3 py-12">
                                        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                                        <span className="text-slate-600">Loading PDF...</span>
                                    </div>
                                ) : pdfUrl ? (
                                    <PDFDocument
                                        file={pdfUrl}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={onDocumentLoadError}
                                        loading={
                                            <div className="flex items-center gap-3 py-12">
                                                <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                                                <span className="text-slate-600">Loading pages...</span>
                                            </div>
                                        }
                                    >
                                        <PDFPage
                                            pageNumber={pageNumber}
                                            scale={scale}
                                            renderTextLayer={true}
                                            renderAnnotationLayer={true}
                                            className="shadow-lg"
                                        />
                                    </PDFDocument>
                                ) : (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-md">
                                        <p className="text-amber-900 font-medium">PDF not available</p>
                                        <p className="text-sm text-amber-700 mt-1">
                                            Unable to load PDF content. Please try again.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Text Preview (DOCX/TXT) */}
                        {(isDocx || isText) && (
                            <div className="max-w-4xl mx-auto">
                                {isLoadingText ? (
                                    <div className="flex items-center gap-3 py-12 justify-center">
                                        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                                        <span className="text-slate-600">Loading document...</span>
                                    </div>
                                ) : textContent ? (
                                    <div className="bg-white rounded-lg shadow-sm p-8">
                                        <div className="prose prose-slate max-w-none">
                                            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">
                                                {textContent}
                                            </pre>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                                        <p className="text-amber-900 font-medium">Preview not available</p>
                                        <p className="text-sm text-amber-700 mt-1">
                                            Unable to load document preview. This file type requires backend processing.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="border-t border-slate-200 p-3 bg-white flex justify-between items-center text-xs text-slate-500 flex-shrink-0">
                        <span>Document ID: {doc.id}</span>
                        {doc.chunkCount && <span>{doc.chunkCount} chunks processed</span>}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
