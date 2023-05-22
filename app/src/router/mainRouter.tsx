import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from '../pages/error/error'

import Dashboard from '../pages/dashboard/Dashboard'
import Students from '../pages/students/Students'
import StudentsArchive from '../pages/students/studentsArchive/StudentsArchive'
import Timetable from '../pages/timetable/Timetable.component'
import Lessons from '../pages/lessons/Lessons'
import Application from '../Application'
import Settings from '../pages/settings/Settings'
import StudentsActive from '../pages/students/studentsActive/StudentsActive'
import ToDos from '../pages/todos/Todos.page'
import TodosOpen from '../pages/todos/TodosOpen.page'
import TodosCompleted from '../pages/todos/TodosCompleted.page'
import Account from '../pages/settings/account/Account'
import TermsAndConditionsPage from '../pages/terms/TermsAndConditionsPage'
import PrivacyPolicyPage from '../pages/privacy/PrivacyPolicyPage'

export const mainRouter = createBrowserRouter(
  [
    {
      path: `/`,
      element: <Application />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: `students`,
          element: <Students />,
          children: [
            {
              index: true,
              path: '',
              element: <StudentsActive />,
            },
            {
              path: `archive`,
              element: <StudentsArchive />,
            },
          ],
        },
        {
          path: `timetable`,
          element: <Timetable />,
        },
        {
          path: `lessons`,
          element: <Lessons />,
        },
        {
          path: `todos`,
          element: <ToDos />,
          children: [
            { index: true, path: '', element: <TodosOpen /> },
            { path: 'completed', element: <TodosCompleted /> },
          ],
        },
        {
          path: `settings`,
          element: <Settings />,
          children: [
            {
              index: true,
              path: '',
              element: <Account />,
            },
          ],
        },
        {
          path: `terms`,
          element: <TermsAndConditionsPage />,
        },
        {
          path: `privacy`,
          element: <PrivacyPolicyPage />,
        },
      ],
    },
  ],
  {
    basename: '/',
  }
)
