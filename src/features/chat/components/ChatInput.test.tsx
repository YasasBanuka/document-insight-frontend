import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
    it('renders input and send button', () => {
        const onSendMessage = vi.fn();
        render(<ChatInput onSendMessage={onSendMessage} isLoading={false} />);

        expect(screen.getByPlaceholderText('Type your question...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('updates input value when typing', () => {
        const onSendMessage = vi.fn();
        render(<ChatInput onSendMessage={onSendMessage} isLoading={false} />);

        const input = screen.getByPlaceholderText('Type your question...') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Hello' } });

        expect(input.value).toBe('Hello');
    });

    it('calls onSendMessage and clears input on submit', () => {
        const onSendMessage = vi.fn();
        render(<ChatInput onSendMessage={onSendMessage} isLoading={false} />);

        const input = screen.getByPlaceholderText('Type your question...');
        const sendButton = screen.getByRole('button', { name: /send/i });

        fireEvent.change(input, { target: { value: 'Testing query' } });
        fireEvent.click(sendButton);

        expect(onSendMessage).toHaveBeenCalledWith('Testing query');
        expect((input as HTMLInputElement).value).toBe('');
    });

    it('is disabled when isLoading is true', () => {
        const onSendMessage = vi.fn();
        render(<ChatInput onSendMessage={onSendMessage} isLoading={true} />);

        const input = screen.getByPlaceholderText('Type your question...');
        const sendButton = screen.getByRole('button', { name: /send/i });

        expect(input).toBeDisabled();
        expect(sendButton).toBeDisabled();
    });

    it('send button is disabled when input is empty or whitespace', () => {
        const onSendMessage = vi.fn();
        render(<ChatInput onSendMessage={onSendMessage} isLoading={false} />);

        const input = screen.getByPlaceholderText('Type your question...');
        const sendButton = screen.getByRole('button', { name: /send/i });

        expect(sendButton).toBeDisabled();

        fireEvent.change(input, { target: { value: '   ' } });
        expect(sendButton).toBeDisabled();
    });
});
