import axios from 'axios';
import toast from 'react-hot-toast';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Add access token to requests
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    // Don't add token to auth endpoints
    if (accessToken && !config.url?.includes('/auth/')) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if this is a refresh token request failing
      if (originalRequest.url?.includes('/auth/refresh')) {
        // Refresh token is invalid, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }
      // Access token expired, try to refresh
      if (isRefreshing) {
        // Already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // No refresh token, logout
        window.location.href = '/login';
        return Promise.reject(error);
      }
      try {
        // Call refresh endpoint
        const response = await apiClient.post('/auth/refresh', {
          refresh_token: refreshToken,
        });
        const { access_token, refresh_token: newRefreshToken } = response.data;
        // Save new tokens
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', newRefreshToken);
        // Update authorization header
        apiClient.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        // Process queued requests
        processQueue(null, access_token);
        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 429 Rate Limit
    if (error.response?.status === 429) {
      const retryAfter = error.response.data?.retryAfter || 60;

      // Show toast with countdown
      toast.error(
        `🚫 Rate limited! Please wait ${retryAfter} seconds before retrying.`,
        { duration: 5000 }  // Show for 5 seconds
      );

      console.warn(`Rate limited. Retry after ${retryAfter} seconds`);

      return Promise.reject(error);
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);