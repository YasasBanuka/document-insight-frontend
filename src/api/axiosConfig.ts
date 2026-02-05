import axios from 'axios';

// 1. Create the instance
export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Pointing to your Spring Boot Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add an "Interceptor" (The Doorman)
// This runs on EVERY response before your components see it.
apiClient.interceptors.response.use(
  (response) => {
    // If usage is successful (2xx), just return data
    return response;
  },
  (error) => {
    // If error (4xx, 5xx), log it here!
    // In a real app, you might trigger a Toast notification here.
    console.error('Global API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);