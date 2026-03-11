import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + K to focus input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 p-2.5 sm:p-4 bg-white flex-shrink-0">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          disabled={isLoading}
          aria-label="Chat message input"
          className="flex-1 px-3 py-2.5 sm:px-5 sm:py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed text-sm sm:text-base text-slate-900 placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          className="px-4 py-2.5 sm:px-6 sm:py-3.5 bg-gradient-primary text-white rounded-xl font-medium sm:text-base hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg shadow-primary-500/30"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
      <p className="text-[10px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2 hidden sm:block">
        Press Enter to send • Ctrl+K to focus
      </p>
    </form>
  );
}