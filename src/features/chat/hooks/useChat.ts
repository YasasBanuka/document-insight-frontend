import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { documentApi } from '../../documents/api/documentApi';
import type { ChatMessage, ChatResponse } from '../../../types/api.types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);

  const askMutation = useMutation({
    mutationFn: async (question: string): Promise<ChatResponse & { conversationId?: number }> => {
      if (conversationId) {
        return documentApi.addToConversation(conversationId, question);
      } else {
        return documentApi.createConversation(question);
      }
    },
    onSuccess: (data) => {
      // Set conversation ID if new
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Add answer to messages
      const answerMessage: ChatMessage = {
        id: Date.now().toString() + '-answer',
        type: 'answer',
        content: data.answer,
        sources: data.sources,
        timestamp: new Date(),
      };

      setMessages(prev => prev.map(msg =>
        msg.isLoading ? answerMessage : msg
      ));
    },
    onError: (error: any) => {
      let errorContent: string;
      const status = error.response?.status;

      if (status === 429) {
        const retryAfter = error.response.data?.retryAfter || 60;
        errorContent = `⏱️ Rate limit reached. Please wait ${retryAfter} seconds before trying again.`;
      } else if (status === 401 || status === 403) {
        errorContent = '🔒 Your session has expired. Please log in again.';
      } else if (status === 404) {
        errorContent = '📄 No documents found. Please upload some documents first, then try asking again.';
      } else if (status === 500) {
        errorContent = '⚠️ Something went wrong on our end. Please try again in a moment.';
      } else if (status === 503) {
        errorContent = '🔧 Our servers are busy right now. Please try again shortly.';
      } else if (!error.response) {
        errorContent = '🌐 Unable to connect. Please check your internet connection and try again.';
      } else {
        errorContent = '⚠️ Something went wrong. Please try again.';
      }

      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        type: 'answer',
        content: errorContent,
        timestamp: new Date(),
      };

      setMessages(prev => prev.map(msg =>
        msg.isLoading ? errorMessage : msg
      ));
    },
  });

  const sendMessage = (question: string) => {
    if (!question.trim()) return;
    const questionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'question',
      content: question,
      timestamp: new Date(),
    };

    const loadingMessage: ChatMessage = {
      id: Date.now().toString() + '-loading',
      type: 'answer',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, questionMessage, loadingMessage]);
    askMutation.mutate(question);
  };

  const loadConversation = (id: number) => {
    documentApi.getConversation(id).then(data => {
      setConversationId(id);
      setMessages(data.messages.map(msg => ({
        id: msg.id.toString(),
        type: msg.type.toLowerCase() as 'question' | 'answer',
        content: msg.content,
        sources: msg.sources,
        timestamp: new Date(msg.createdAt),
      })));
    });
  };

  return {
    messages,
    conversationId,
    sendMessage,
    loadConversation,
    clearChat: () => { setMessages([]); setConversationId(null); },
    isLoading: askMutation.isPending,
  };
}