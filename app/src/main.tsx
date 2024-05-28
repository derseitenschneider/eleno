import React from "react"
import ReactDOM from "react-dom/client"
// import './scss/main.scss'
import "./scss/tailwind.css"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { RouterProvider } from "react-router-dom"

import mainRouter from "./router/mainRouter"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={mainRouter} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
)
