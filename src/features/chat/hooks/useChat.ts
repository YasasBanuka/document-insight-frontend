import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentApi } from '../../documents/api/documentApi';
import type { ChatMessage, ChatResponse } from '../../../types/api.types';
import { useChatStore } from '../../../store/chatStore';

export function useChat() {
  const {
    messages,
    conversationId,
    isLoading,
    addMessage,
    updateMessage,
    setMessages,
    setConversationId,
    setLoading,
    clearChat: clearStoreAction
  } = useChatStore();

  const queryClient = useQueryClient();

  const askMutation = useMutation({
    mutationFn: async (question: string): Promise<ChatResponse & { conversationId?: number }> => {
      setLoading(true);
      if (conversationId) {
        return documentApi.addToConversation(conversationId, question);
      } else {
        return documentApi.createConversation(question);
      }
    },
    onSuccess: (data) => {
      setLoading(false);
      // Set conversation ID if new
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }

      // Add answer to messages
      const answerMessage: ChatMessage = {
        id: Date.now().toString() + '-answer',
        type: 'answer',
        content: data.answer,
        sources: data.sources,
        timestamp: new Date(),
      };

      // Find and update the loading message
      const loadingMsg = messages.find(m => m.isLoading);
      if (loadingMsg) {
        updateMessage(loadingMsg.id, { ...answerMessage, isLoading: false });
      } else {
        addMessage(answerMessage);
      }
    },
    onError: (error: any) => {
      setLoading(false);
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

      const loadingMsg = messages.find(m => m.isLoading);
      if (loadingMsg) {
        updateMessage(loadingMsg.id, { ...errorMessage, isLoading: false });
      } else {
        addMessage(errorMessage);
      }
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

    addMessage(questionMessage);
    addMessage(loadingMessage);
    askMutation.mutate(question);
  };

  const loadConversation = (id: number) => {
    setLoading(true);
    documentApi.getConversation(id).then(data => {
      setLoading(false);
      setConversationId(id);
      setMessages(data.messages.map(msg => ({
        id: msg.id.toString(),
        type: msg.type.toLowerCase() as 'question' | 'answer',
        content: msg.content,
        sources: msg.sources,
        timestamp: new Date(msg.createdAt),
      })));
    }).catch(() => {
      setLoading(false);
    });
  };

  return {
    messages,
    conversationId,
    sendMessage,
    loadConversation,
    clearChat: clearStoreAction,
    isLoading: askMutation.isPending || isLoading,
  };
}
