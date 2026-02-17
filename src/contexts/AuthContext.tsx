/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import toast from "react-hot-toast";
import * as authService from '../services/authService';
import type { User, AuthContextType } from '../types/auth';

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load auth from localStorage on mount
  useEffect(() => {
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedUser = localStorage.getItem('user');
    if (savedAccessToken && savedRefreshToken && savedUser) {
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Save tokens to localStorage
  const saveTokens = (access: string, refresh: string, userData: User) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });
      saveTokens(data.accessToken, data.refreshToken, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
    } catch (error: any) {
      // Skip 429 errors - already handled by axios interceptor
      if (error.response?.status !== 429) {
        const message = error.response?.data?.message || 'Login failed';
        toast.error(message);
      }
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await authService.register({ name, email, password });
      saveTokens(data.accessToken, data.refreshToken, data.user);
      toast.success(`Welcome to Docura, ${data.user.name}!`);
    } catch (error: any) {
      // Skip 429 errors - already handled by axios interceptor
      if (error.response?.status !== 429) {
        const message = error.response?.data?.message || 'Registration failed';
        toast.error(message);
      }
      throw error;
    }
  };

  // Refresh tokens function
  const refreshTokensFunc = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const data = await authService.refreshTokens(refreshToken);
      saveTokens(data.accessToken, data.refreshToken, data.user);

      console.log('Tokens refreshed successfully');
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Update user profile
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshTokens: refreshTokensFunc,
    updateUser
  };

  return(
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};