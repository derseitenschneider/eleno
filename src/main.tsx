import React from 'react'
import ReactDOM from 'react-dom/client'
// import './main.css'
import './scss/global.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ErrorPage from './pages/error/error'

import Dashboard from './pages/dashboard/Dashboard'
import Students from './pages/students/Students'
import StudentList from './pages/students/studentsActive/StudentsActive'
import StudentsArchive from './pages/students/studentsArchive/StudentsArchive'
import Timetable from './pages/timetable/Timetable.component'
import Lessons from './pages/lessons/Lessons'
import ToDos from './pages/todos/ToDos'
import Application from './Application'
import Settings from './pages/settings/Settings'
import ResetPW from './pages/settings/reset-pw/ResetPw'
import StudentsActive from './pages/students/studentsActive/StudentsActive'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Application />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'students',

        element: <Students />,
        children: [
          {
            index: true,
            path: '',
            element: <StudentsActive />,
          },
          {
            path: 'archive',
            element: <StudentsArchive />,
          },
        ],
      },
      {
        path: 'timetable',
        element: <Timetable />,
      },
      {
        path: 'lessons',
        element: <Lessons />,
      },
      {
        path: 'todos',
        element: <ToDos />,
      },
      {
        path: 'settings',
        element: <Settings />,
        children: [
          {
            path: 'reset-pw',
            element: <ResetPW />,
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
