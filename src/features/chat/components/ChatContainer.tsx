import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Trash2, Sparkles, Download, FileText, Save, History } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { ConversationHistory } from './ConversationHistory';

export function ChatContainer() {
  const { messages, sendMessage, clearChat, isLoading, loadConversation } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClearChat = () => {
    clearChat();
    setClearDialogOpen(false);
    toast.success('Conversation cleared');
  };

  const handleSendMessage = (message: string) => {
    sendMessage(message);
    toast.loading('Thinking...', {
      id: 'chat-loading',
      duration: 30000,
    });
  };

  const exportToMarkdown = () => {
    const markdown = messages.map(msg => {
      const prefix = msg.type === 'question' ? '**You:**' : '**Docura:**';
      return `${prefix}\n${msg.content}\n`;
    }).join('\n---\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `docura-chat-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported as Markdown');
    setShowExportMenu(false);
  };

  const exportToJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `docura-chat-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported as JSON');
    setShowExportMenu(false);
  };

  useEffect(() => {
    if (!isLoading) {
      toast.dismiss('chat-loading');
    }
  }, [isLoading]);

  // Close export menu when clicking outside
  useEffect(() => {
    if (!showExportMenu) return;
    const handler = () => setShowExportMenu(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showExportMenu]);

  return (
    <>
      <div className="flex gap-0 md:gap-6 h-[calc(100vh-8rem)] md:h-[calc(100vh-8rem)] min-h-[500px]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-72 lg:w-80 flex-shrink-0">
          <ConversationHistory loadConversation={loadConversation} />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              />
              {/* Slide-out panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-[80vw] max-w-[320px] z-50 md:hidden"
              >
                <ConversationHistory
                  loadConversation={loadConversation}
                  onClose={() => setSidebarOpen(false)}
                  isMobile
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Chat Panel */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col min-w-0">
          {/* Header */}
          <div className="border-b border-slate-200 px-3 py-3 sm:px-6 sm:py-4 flex justify-between items-center bg-white flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Mobile history toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors flex-shrink-0"
                aria-label="Open history"
              >
                <History className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent truncate">
                    Chat with Docura
                  </h2>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0" />
                </div>
                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                  Ask questions and get intelligent answers from your documents
                </p>
              </div>
            </div>

            {messages.length > 0 && (
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {/* Export Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowExportMenu(!showExportMenu); }}
                    className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 sm:px-3 sm:py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                    aria-label="Export conversation"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden lg:inline">Export</span>
                  </button>

                  <AnimatePresence>
                    {showExportMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={exportToMarkdown}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4 text-slate-400" />
                          Export as Markdown
                        </button>
                        <button
                          onClick={exportToJSON}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                          <Save className="w-4 h-4 text-slate-400" />
                          Export as JSON
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => setClearDialogOpen(true)}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 sm:px-3 sm:py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                  aria-label="Clear conversation"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden lg:inline">Clear</span>
                </button>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-3 py-3 sm:p-4 bg-gradient-to-b from-slate-50 to-white">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full px-4"
              >
                <div className="p-4 bg-gradient-to-br from-primary-50 to-cyan-50 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-primary-500" />
                </div>
                <p className="text-base sm:text-lg font-semibold text-slate-700 mb-2">Ready to help</p>
                <p className="text-xs sm:text-sm text-slate-500 mb-6 text-center max-w-md">
                  Ask anything about your uploaded documents
                </p>

                {/* Example prompts */}
                <div className="space-y-2 w-full max-w-md">
                  <p className="text-xs font-medium text-slate-600 mb-2">Try asking:</p>
                  {[
                    'What are the main topics in my documents?',
                    'Summarize the key points',
                    'Find information about [topic]'
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(example.replace('[topic]', 'technology'))}
                      className="w-full text-left px-3 py-2.5 sm:px-4 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-600 hover:border-primary-300 hover:bg-primary-50/50 transition-all active:scale-[0.98]"
                    >
                      • {example}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <MessageBubble message={message} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        onConfirm={handleClearChat}
        title="Clear Conversation?"
        message="Are you sure you want to clear all messages? This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
}