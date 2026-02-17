import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'

// Create a client (singleton pattern)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            // Default options
            duration: 4000,
            style: {
              background: '#fff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              padding: '12px 16px',
              fontSize: '14px',
            },
            // Success toasts
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            // Error toasts
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              duration: 5000,
            },
          }}
        />
        {/* Global Tooltips */}
        <Tooltip
          id="copy-tooltip"
          place="top"
          style={{
            backgroundColor: '#0f172a',
            color: '#fff',
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: '6px',
          }}
        />
        <Tooltip
          id="doc-tooltip"
          place="top"
          style={{
            backgroundColor: '#0f172a',
            color: '#fff',
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: '6px',
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)