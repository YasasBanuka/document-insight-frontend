// Backend response - what we ACTUALLY get
export interface BackendAuthResponse {
  access_token: string;
  refresh_token: string;
  user_id: number;
  email: string;
  role: string;
  token_type: string;
}

// User object from backend
export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

// Login request
export interface LoginRequest {
    email: string;
    password: string;
}

// Register request
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

// Auth response from backend
export interface AuthResponse {
    accessToken: string;   
    refreshToken: string; 
    user: User;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;  
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<void>; 
  updateUser: (updateUser: User) => void;
}