import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AlterConfigProvider } from './core/context/config.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './routes.tsx';
import './index.css'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AlterConfigProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </AlterConfigProvider>
  </StrictMode>,
)
