import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Trash2, Sparkles, Download, FileText, Save } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export function ChatContainer() {
  const { messages, sendMessage, clearChat, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

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

    // Show loading toast
    toast.loading('Thinking...', {
      id: 'chat-loading',
      duration: 30000, // Long duration, will be dismissed when response comes
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

  // Dismiss loading toast when not loading anymore
  useEffect(() => {
    if (!isLoading) {
      toast.dismiss('chat-loading');
    }
  }, [isLoading]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-[600px]">
        {/* Simplified Header */}
        <div className="border-b border-slate-200 p-6 flex justify-between items-center bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Chat with Docura
              </h2>
              <Sparkles className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-sm text-slate-500">
              Ask questions and get intelligent answers from your documents
            </p>
          </div>

          {messages.length > 0 && (
            <div className="flex items-center gap-2">
              {/* Export Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                  aria-label="Export conversation"
                  data-tooltip-id="doc-tooltip"
                  data-tooltip-content="Export conversation"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-10">
                    <button
                      onClick={exportToMarkdown}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Export as Markdown
                    </button>
                    <button
                      onClick={exportToJSON}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Export as JSON
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setClearDialogOpen(true)}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                aria-label="Clear conversation"
                data-tooltip-id="doc-tooltip"
                data-tooltip-content="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 to-white">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <div className="p-4 bg-gradient-to-br from-primary-50 to-cyan-50 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-primary-500" />
              </div>
              <p className="text-lg font-semibold text-slate-700 mb-2">Ready to help</p>
              <p className="text-sm text-slate-500 mb-6 text-center max-w-md">
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
                    className="w-full text-left px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-primary-300 hover:bg-primary-50/50 transition-all"
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