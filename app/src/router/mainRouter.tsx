import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../pages/error/error'

import Dashboard from '../pages/dashboard/Dashboard'
import Students from '../pages/students/Students'

import Application from '../Application'
import Lessons from '../pages/lessons/Lessons'
import Settings from '../pages/settings/Settings'
import Timetable from '../pages/timetable/Timetable.component'

import Account from '../pages/settings/account/Account'
import ToDos from '../pages/todos/Todos.page'
import TodosCompleted from '../pages/todos/TodosCompleted.page'
import TodosOpen from '../pages/todos/TodosOpen.page'

import ActiveStudents from '../components/features/students/activeStudents/ActiveStudents.component'
import ArchivatedStudents from '../components/features/students/inActiveStudents/InactiveStudents.component'

const mainRouter = createBrowserRouter(
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
          path: 'students',
          element: <Students />,
          children: [
            {
              index: true,
              path: '',
              element: <ActiveStudents />,
            },
            {
              path: `archive`,
              element: <ArchivatedStudents />,
            },
          ],
        },
        {
          path: `timetable`,
          element: <Timetable />,
        },
        {
          path: 'lessons',
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
      ],
    },
  ],
  {
    basename: '/',
  },
)
export default mainRouter
