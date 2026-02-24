import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChat } from './useChat';
import { useChatStore } from '../../../store/chatStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { documentApi } from '../../documents/api/documentApi';
import React from 'react';

// Mock dependencies
vi.mock('../../documents/api/documentApi');

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useChat hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useChatStore.getState().clearChat();
    });

    it('should send a message and update store with question and loading', async () => {
        const { result } = renderHook(() => useChat(), { wrapper: createWrapper() });

        vi.mocked(documentApi.createConversation).mockResolvedValue({
            answer: 'Hello from AI',
            conversationId: 101,
            sources: []
        });

        result.current.sendMessage('Hello');

        // Expected 2 messages: Question and Loading Answer
        expect(useChatStore.getState().messages).toHaveLength(2);
        expect(useChatStore.getState().messages[0].type).toBe('question');
        expect(useChatStore.getState().messages[1].isLoading).toBe(true);

        // Wait for mutation to finish
        await waitFor(() => expect(useChatStore.getState().isLoading).toBe(false));

        // Verify answer replaced loading message
        expect(useChatStore.getState().messages).toHaveLength(2);
        expect(useChatStore.getState().messages[1].content).toBe('Hello from AI');
        expect(useChatStore.getState().messages[1].isLoading).toBe(false);
    });

    it('should load conversation and sync to store', async () => {
        const { result } = renderHook(() => useChat(), { wrapper: createWrapper() });

        const mockConv = {
            id: 1,
            title: 'Old chat',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [
                { id: 1, type: 'QUESTION', content: 'What?', createdAt: new Date().toISOString() }
            ]
        };

        vi.mocked(documentApi.getConversation).mockResolvedValue(mockConv);

        result.current.loadConversation(1);

        await waitFor(() => expect(useChatStore.getState().messages).toHaveLength(1));
        expect(useChatStore.getState().conversationId).toBe(1);
        expect(useChatStore.getState().messages[0].content).toBe('What?');
    });
});
