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
  const [showSources, setShowSources] = useState(false);

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
    <div className={`flex ${isQuestion ? 'justify-end' : 'justify-start'} mb-4 sm:mb-6 group`}>
      <div
        className={`max-w-[95%] sm:max-w-[90%] md:max-w-[85%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 relative shadow-sm ${isQuestion
          ? 'bg-gradient-primary text-white shadow-primary-500/20'
          : 'bg-white text-slate-800 border border-slate-200'
          }`}
      >
        {message.isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-slate-600 animate-spin" />
            <span className="text-sm text-slate-600">Thinking...</span>
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed pr-8 sm:pr-10">
              {message.content}
            </div>

            {/* Copy button - always visible on mobile (no hover) */}
            <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 p-1.5 rounded sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ${isQuestion
                ? 'hover:bg-white/10'
                : 'hover:bg-slate-100'
                }`}
              aria-label="Copy message"
            >
              {copied ? (
                <Check className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isQuestion ? 'text-white' : 'text-green-600'}`} />
              ) : (
                <Copy className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isQuestion ? 'text-white/70' : 'text-slate-400'}`} />
              )}
            </button>
          </>
        )}

        <div className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 ${isQuestion ? 'text-white/70' : 'text-slate-400'}`}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>

        {/* Sources Section - Only show for answers with sources */}
        {!isQuestion && message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            {/* Toggle button */}
            <button
              onClick={() => setShowSources(!showSources)}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors"
            >
              <span>{showSources ? '▼' : '▶'}</span>
              <span>{message.sources.length} source{message.sources.length > 1 ? 's' : ''}</span>
            </button>

            {/* Expandable sources list */}
            {showSources && (
              <div className="mt-2 space-y-1">
                {message.sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-slate-50 rounded px-3 py-2 flex items-center justify-between hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-primary-500">📄</span>
                      <span className="font-medium text-slate-700">{source.filename}</span>
                    </div>
                    <span className="text-slate-400 text-xs font-mono">
                      {(source.similarity * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

