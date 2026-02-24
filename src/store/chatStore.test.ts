import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from './chatStore';
import type { ChatMessage } from '../types/api.types';

describe('chatStore', () => {
    // Reset store before each test
    beforeEach(() => {
        useChatStore.getState().clearChat();
    });

    it('should have initial state', () => {
        const state = useChatStore.getState();
        expect(state.messages).toEqual([]);
        expect(state.conversationId).toBeNull();
        expect(state.isLoading).toBe(false);
    });

    it('should add messages', () => {
        const message: ChatMessage = {
            id: '1',
            type: 'question',
            content: 'Hello',
            timestamp: new Date(),
        };

        useChatStore.getState().addMessage(message);

        expect(useChatStore.getState().messages).toHaveLength(1);
        expect(useChatStore.getState().messages[0].content).toBe('Hello');
    });

    it('should update specific message', () => {
        const message: ChatMessage = {
            id: 'loading-id',
            type: 'answer',
            content: '',
            timestamp: new Date(),
            isLoading: true
        };

        useChatStore.getState().addMessage(message);
        useChatStore.getState().updateMessage('loading-id', {
            content: 'Final Answer',
            isLoading: false
        });

        const updated = useChatStore.getState().messages[0];
        expect(updated.content).toBe('Final Answer');
        expect(updated.isLoading).toBe(false);
    });

    it('should set conversation ID', () => {
        useChatStore.getState().setConversationId(123);
        expect(useChatStore.getState().conversationId).toBe(123);
    });

    it('should handle sets and clears', () => {
        useChatStore.getState().setLoading(true);
        expect(useChatStore.getState().isLoading).toBe(true);

        useChatStore.getState().clearChat();
        expect(useChatStore.getState().isLoading).toBe(false);
        expect(useChatStore.getState().messages).toHaveLength(0);
    });
});
