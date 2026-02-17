import type { BackendAuthResponse, AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
import { apiClient } from "../api/axiosConfig";

// Transform backend response to frontend format
function transformAuthResponse(backend: BackendAuthResponse): AuthResponse {
  return {
    accessToken: backend.access_token,
    refreshToken: backend.refresh_token,
    user: {
      id: backend.user_id,
      email: backend.email,
      name: backend.email.split('@')[0], // Temporary: extract from email
      role: backend.role
    }
  };
}

// Login API call
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<BackendAuthResponse>(
    '/auth/login', 
    data
  );
  return transformAuthResponse(response.data);
};

// Register API call
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<BackendAuthResponse>(
    '/auth/register', 
    data
  );
  return transformAuthResponse(response.data);
};

// Refresh tokens
export const refreshTokens = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await apiClient.post<BackendAuthResponse>(
    '/auth/refresh',
    { refresh_token: refreshToken }
  );
  return transformAuthResponse(response.data);
};

// Logout (clear local storage)
export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};