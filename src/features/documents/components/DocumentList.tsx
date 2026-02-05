import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { documentApi } from '../api/documentApi';
import { DocumentCard } from './DocumentCard';
import { DocumentCardSkeleton } from '../../../components/ui/Skeleton';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useState } from 'react';

export function DocumentList() {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{ id: number; filename: string } | null>(null);

  const { data: documents, isLoading, isError, error } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentApi.getAll(),
    refetchOnWindowFocus: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => documentApi.delete(id),
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['documents'] });

      // Snapshot previous value
      const previousDocuments = queryClient.getQueryData(['documents']);

      // Optimistically remove from UI
      queryClient.setQueryData(['documents'], (old: any) =>
        old?.filter((doc: any) => doc.id !== deletedId)
      );

      return { previousDocuments };
    },
    onSuccess: (_, deletedId) => {
      const deletedDoc = documents?.find(doc => doc.id === deletedId);

      toast.success(
        `${deletedDoc?.filename || 'Document'} deleted successfully`,
        {
          duration: 4000,
        }
      );
    },
    onError: (error: Error, _, context) => {
      // Rollback on error
      queryClient.setQueryData(['documents'], context?.previousDocuments);

      toast.error(
        `Failed to delete document: ${error.message}`,
        {
          duration: 5000,
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const handleDeleteClick = (id: number, filename: string) => {
    setDocumentToDelete({ id, filename });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      deleteMutation.mutate(documentToDelete.id);
      setDocumentToDelete(null);
    }
  };

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Loading documents...
        </h2>
        <div className="space-y-3">
          <DocumentCardSkeleton />
          <DocumentCardSkeleton />
          <DocumentCardSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-900 font-medium mb-2">Failed to load documents</p>
        <p className="text-sm text-red-700">
          {error instanceof Error ? error.message : 'Please try refreshing the page'}
        </p>
      </div>
    );
  }

  // Empty state
  if (!documents || documents.length === 0) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
        <div className="p-4 bg-slate-100 rounded-full inline-block mb-4">
          <svg
            className="w-12 h-12 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No documents yet</h3>
        <p className="text-sm text-slate-500 mb-4">Upload your first document to get started!</p>
        <p className="text-xs text-slate-400">Supported: PDF, DOCX, TXT files up to 10MB</p>
      </div>
    );
  }

  // Document list
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Uploaded Documents ({documents.length})
          </h2>
        </div>

        <div className="space-y-3">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={() => handleDeleteClick(document.id, document.filename)}
            />
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDocumentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Document?"
        message={`Are you sure you want to delete "${documentToDelete?.filename}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}