import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MessageBubble } from './MessageBubble';
import type { ChatMessage } from '../../../types/api.types';

describe('MessageBubble', () => {
    const mockTimestamp = new Date('2024-01-01T12:00:00');

    it('renders user message (question) correctly', () => {
        const message: ChatMessage = {
            id: '1',
            type: 'question',
            content: 'How do I use this app?',
            timestamp: mockTimestamp,
            isLoading: false
        };

        render(<MessageBubble message={message} />);

        expect(screen.getByText('How do I use this app?')).toBeInTheDocument();
        // The colored bubble is the second-to-last div (parent of the text container)
        // We can use a test-id or better yet, just check the hierarchy
        const textElement = screen.getByText('How do I use this app?');
        const bubbleElement = textElement.closest('.bg-gradient-primary');
        expect(bubbleElement).toBeInTheDocument();
    });

    it('renders agent message (answer) correctly', () => {
        const message: ChatMessage = {
            id: '2',
            type: 'answer',
            content: 'This is the answer.',
            timestamp: mockTimestamp,
            isLoading: false,
            sources: []
        };

        render(<MessageBubble message={message} />);

        expect(screen.getByText('This is the answer.')).toBeInTheDocument();
        const bubbleElement = screen.getByText('This is the answer.').closest('.bg-white');
        expect(bubbleElement).toBeInTheDocument();
    });

    it('shows loading state when thinking', () => {
        const message: ChatMessage = {
            id: '3',
            type: 'answer',
            content: '',
            timestamp: mockTimestamp,
            isLoading: true
        };

        render(<MessageBubble message={message} />);

        expect(screen.getByText('Thinking...')).toBeInTheDocument();
    });

    it('toggles sources when clicked', () => {
        const message: ChatMessage = {
            id: '4',
            type: 'answer',
            content: 'Answer with sources',
            timestamp: mockTimestamp,
            isLoading: false,
            sources: [
                { filename: 'doc1.pdf', similarity: 0.95, documentId: 101 }
            ]
        };

        render(<MessageBubble message={message} />);

        // Initially sources list is hidden
        expect(screen.queryByText('doc1.pdf')).not.toBeInTheDocument();

        // Click toggle
        const toggle = screen.getByText(/1 source/);
        fireEvent.click(toggle);

        // Now visible
        expect(screen.getByText('doc1.pdf')).toBeInTheDocument();
    });
});
