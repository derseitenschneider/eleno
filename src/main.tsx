import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import ErrorPage from "./pages/error";

import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Timetable from './pages/Timetable';
import Lessons from './pages/Lessons';
import ToDos from './pages/ToDos';
import RootLayout from './pages/RootLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Dashboard/>
      },
      {
        path: '/students',
        element: <Students/>
      },
      {
        path: '/timetable',
        element: <Timetable/>
      },
       {
        path: '/lessons',
        element: <Lessons/>
      },
       {
        path: '/todos',
        element: <ToDos/>
      },
    ]
  },

]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>,
)
