import { create } from 'zustand';
import type { ChatMessage } from '../types/api.types';

interface ChatState {
    messages: ChatMessage[];
    conversationId: number | null;
    isLoading: boolean;

    // Actions
    addMessage: (message: ChatMessage) => void;
    updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
    setMessages: (messages: ChatMessage[]) => void;
    setConversationId: (id: number | null) => void;
    setLoading: (loading: boolean) => void;
    clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    conversationId: null,
    isLoading: false,

    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message]
        })),

    updateMessage: (id, updates) =>
        set((state) => ({
            messages: state.messages.map((msg) =>
                msg.id === id ? { ...msg, ...updates } : msg
            ),
        })),

    setMessages: (messages) => set({ messages }),

    setConversationId: (conversationId) => set({ conversationId }),

    setLoading: (isLoading) => set({ isLoading }),

    clearChat: () => set({
        messages: [],
        conversationId: null,
        isLoading: false
    }),
}));
