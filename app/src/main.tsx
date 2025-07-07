import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/tailwind.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initializeServiceWorker } from './initializeServiceWorker'

import { RouterProvider } from 'react-router-dom'

import mainRouter from './router/mainRouter'

const queryClient = new QueryClient()

initializeServiceWorker()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={mainRouter} />
      <ReactQueryDevtools buttonPosition='bottom-right' />
    </QueryClientProvider>
  </React.StrictMode>,
)
