import React from 'react'
import ReactDOM from 'react-dom/client'
// import './scss/main.scss'
import './scss/tailwind.css'

import { RouterProvider } from 'react-router-dom'

import mainRouter from './router/mainRouter'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={mainRouter} />
  </React.StrictMode>,
)
