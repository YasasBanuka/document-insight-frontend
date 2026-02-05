import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import type { ChatMessage } from '../../../types/api.types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isQuestion = message.type === 'question';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success('Message copied', { icon: '📋', duration: 2000 });

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  return (
    <div className={`flex ${isQuestion ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 relative ${isQuestion
            ? 'bg-gradient-primary text-white shadow-lg shadow-primary-500/20'
            : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
          }`}
      >
        {message.isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />
            <span className="text-sm text-slate-600">Thinking...</span>
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed pr-8">
              {message.content}
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${isQuestion
                  ? 'hover:bg-white/10'
                  : 'hover:bg-slate-100'
                }`}
              aria-label="Copy message"
            >
              {copied ? (
                <Check className={`w-3.5 h-3.5 ${isQuestion ? 'text-white' : 'text-green-600'}`} />
              ) : (
                <Copy className={`w-3.5 h-3.5 ${isQuestion ? 'text-white/70' : 'text-slate-400'}`} />
              )}
            </button>
          </>
        )}

        <div className={`text-xs mt-2 ${isQuestion ? 'text-white/70' : 'text-slate-400'}`}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}