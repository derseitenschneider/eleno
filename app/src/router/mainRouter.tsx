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
import InactiveStudents from '../components/features/students/inActiveStudents/InactiveStudents.component'
import AllLessons from '../components/features/lessons/allLessons/AllLessons.component'
import Repertoire from '../components/features/repertoire/Repertoire.component'
import View from '../pages/settings/view/View'

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
              element: <InactiveStudents />,
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
          path: '/lessons/all',
          element: <AllLessons />,
        },
        {
          path: '/lessons/repertoire',
          element: <Repertoire />,
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
            {
              index: true,
              path: 'view',
              element: <View />,
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
