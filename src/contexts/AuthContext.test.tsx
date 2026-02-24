import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import * as authService from '../services/authService';
import React from 'react';

// Mock authService
vi.mock('../services/authService', () => ({
    login: vi.fn(),
    register: vi.fn(),
    refreshTokens: vi.fn(),
    logout: vi.fn(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    })
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should initialize with null user if no token in localStorage', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.loading).toBe(false);
    });

    it('should hydrate user from localStorage on mount when all keys exist', () => {
        const mockUser = { id: 1, email: 'test@example.com', name: 'Test User', role: 'USER' };
        localStorage.setItem('accessToken', 'access-123');
        localStorage.setItem('refreshToken', 'refresh-123');
        localStorage.setItem('user', JSON.stringify(mockUser));

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.accessToken).toBe('access-123');
        expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle login and persist tokens', async () => {
        const mockAuthResponse = {
            accessToken: 'new-access',
            refreshToken: 'new-refresh',
            user: { id: 1, email: 'test@example.com', name: 'Test' }
        };

        vi.mocked(authService.login).mockResolvedValue(mockAuthResponse as any);

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            await result.current.login('test@example.com', 'password');
        });

        expect(result.current.user?.email).toBe('test@example.com');
        expect(localStorage.getItem('accessToken')).toBe('new-access');
        expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle logout and clear storage', async () => {
        // Setup initial state via localStorage then render
        const mockUser = { id: 1, email: 'test@example.com', name: 'Test' };
        localStorage.setItem('accessToken', 'val');
        localStorage.setItem('refreshToken', 'ref');
        localStorage.setItem('user', JSON.stringify(mockUser));

        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.logout();
        });

        expect(result.current.user).toBeNull();
        expect(result.current.accessToken).toBeNull();
        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(authService.logout).toHaveBeenCalled();
    });

    it('should handle token refresh failure by logging out', async () => {
        // Fill all hydration keys so refreshToken state is populated
        const mockUser = { id: 1, email: 'test@example.com', name: 'Test' };
        localStorage.setItem('accessToken', 'old-access');
        localStorage.setItem('refreshToken', 'bad-refresh');
        localStorage.setItem('user', JSON.stringify(mockUser));

        const { result } = renderHook(() => useAuth(), { wrapper });

        vi.mocked(authService.refreshTokens).mockRejectedValue(new Error('Expired'));

        await act(async () => {
            try {
                await result.current.refreshTokens();
            } catch (e) {
                // Expected error
            }
        });

        // Should be logged out
        expect(result.current.user).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });
});
