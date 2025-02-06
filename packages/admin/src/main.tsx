import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AlterConfigProvider } from './core/context/config.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AlterConfigProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AlterConfigProvider>
  </StrictMode>,
)
