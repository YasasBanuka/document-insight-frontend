import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentApi } from "../../documents/api/documentApi";
import { Trash2, MessageSquare, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface ConversationHistoryProps {
  loadConversation: (id: number) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function ConversationHistory({ loadConversation, onClose, isMobile }: ConversationHistoryProps) {
  const queryClient = useQueryClient();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => documentApi.getConversations(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => documentApi.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast.success('Conversation deleted');
    },
    onError: () => {
      toast.error('Failed to delete conversation');
    },
  });

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const handleLoad = (id: number) => {
    loadConversation(id);
    onClose?.();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary-50 rounded-lg">
              <MessageSquare className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">History</h3>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock className="w-2.5 h-2.5" />
                <span>Auto-clears after 30 days</span>
              </div>
            </div>
          </div>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close history"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading...</p>
          </div>
        ) : !conversations?.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 bg-slate-50 rounded-full mb-3">
              <MessageSquare className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500">No conversations</p>
            <p className="text-xs text-slate-400 mt-1">Start chatting to see history here</p>
          </div>
        ) : (
          <AnimatePresence>
            {conversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, height: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                onClick={() => handleLoad(conv.id)}
                className="group flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg
                  hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent
                  cursor-pointer transition-all duration-200 mb-0.5
                  active:scale-[0.98]"
              >
                {/* Color indicator */}
                <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary-400 to-primary-200 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate group-hover:text-primary-700 transition-colors">
                    {conv.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatDate(conv.updatedAt)}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  className={`p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0
                    ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  aria-label="Delete conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {conversations && conversations.length > 0 && (
        <div className="flex-shrink-0 px-4 py-2 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] text-slate-400 text-center">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
