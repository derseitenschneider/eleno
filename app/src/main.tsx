import React from 'react'
import ReactDOM from 'react-dom/client'
import './scss/global.scss'
import { RouterProvider } from 'react-router-dom'

import { mainRouter } from './router/mainRouter'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={mainRouter} />
  </React.StrictMode>
)
