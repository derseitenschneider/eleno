import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import ErrorPage from "./pages/error/error";

import Dashboard from './pages/dashboard/Dashboard';
import Students from './pages/students/Students';
import Timetable from './pages/timetable/Timetable';
import Lessons from './pages/lessons/Lessons';
import ToDos from './pages/todos/ToDos';
import Application from './Application';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Application/>,
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
