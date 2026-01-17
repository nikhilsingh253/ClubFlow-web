import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'

import { router } from './routes'
import { GOOGLE_CLIENT_ID } from '@/lib/constants'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  // Auth loading state is now handled by zustand's onRehydrateStorage callback
  // in authStore.ts - no need for manual timeout here

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#3D3D3D',
              border: '1px solid #E8E4E0',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              boxShadow: '0 4px 12px -4px rgba(0, 0, 0, 0.08)',
            },
            success: {
              iconTheme: {
                primary: '#8B9E8B',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#D4A5A5',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

export default App
