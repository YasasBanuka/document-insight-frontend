import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { documentApi } from '../../documents/api/documentApi';
import type { ChatMessage } from '../../../types/api.types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Mutation for asking questions
  const askMutation = useMutation({
    mutationFn: (question: string) => documentApi.askQuestion(question),
    onSuccess: (data) => {
      // Add AI answer to messages
      const answerMessage: ChatMessage = {
        id: Date.now().toString() + '-answer',
        type: 'answer',
        content: data.answer,
        timestamp: new Date(),
      };
      
      setMessages(prev => prev.map(msg => 
        msg.isLoading ? answerMessage : msg
      ));
    },
    onError: (error: Error) => {
      // Replace loading message with error
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        type: 'answer',
        content: `Error: ${error.message}`,
        timestamp: new Date(),
      };
      
      setMessages(prev => prev.map(msg => 
        msg.isLoading ? errorMessage : msg
      ));
    },
  });

  const sendMessage = (question: string) => {
    if (!question.trim()) return;

    // Add user question
    const questionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'question',
      content: question,
      timestamp: new Date(),
    };

    // Add loading placeholder for answer
    const loadingMessage: ChatMessage = {
      id: Date.now().toString() + '-loading',
      type: 'answer',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, questionMessage, loadingMessage]);

    // Call API
    askMutation.mutate(question);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    sendMessage,
    clearChat,
    isLoading: askMutation.isPending,
  };
}