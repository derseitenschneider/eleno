import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../pages/error/error'

import Application from '../Application'

import Account from '../pages/settings/account/Account'
import TodosCompleted from '../pages/todos/TodosCompleted.page'
import TodosOpen from '../pages/todos/TodosOpen.page'

import Groups from '../components/features/groups/Groups.component'
import AllLessons from '../components/features/lessons/allLessons/AllLessons.component'
import Repertoire from '../components/features/repertoire/Repertoire.component'
import ActiveStudents from '../components/features/students/activeStudents/ActiveStudents.component'
import InactiveStudents from '../components/features/students/inActiveStudents/InactiveStudents.component'
import View from '../pages/settings/view/View'

const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const Students = lazy(() => import('../pages/students/Students'))
const Lessons = lazy(() => import('../pages/lessons/Lessons'))
const ToDos = lazy(() => import('../pages/todos/Todos.page'))
const Settings = lazy(() => import('../pages/settings/Settings'))
const Timetable = lazy(() => import('../pages/timetable/Timetable.component'))

const mainRouter = createBrowserRouter(
  [
    {
      path: `/`,
      element: <Application />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<p>...loading</p>}>
              <Dashboard />,
            </Suspense>
          ),
        },
        {
          path: 'students',
          element: (
            <Suspense fallback={<p>...loading</p>}>
              <Students />,
            </Suspense>
          ),
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
            {
              path: `groups`,
              element: <Groups />,
            },
          ],
        },
        {
          path: `timetable`,
          element: (
            <Suspense>
              <Timetable />
            </Suspense>
          ),
        },
        {
          path: 'lessons',
          element: (
            <Suspense fallback={<p>...loading</p>}>
              <Lessons />,
            </Suspense>
          ),
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
          element: (
            <Suspense>
              <ToDos />
            </Suspense>
          ),
          children: [
            { index: true, path: '', element: <TodosOpen /> },
            { path: 'completed', element: <TodosCompleted /> },
          ],
        },
        {
          path: `settings`,
          element: (
            <Suspense>
              <Settings />
            </Suspense>
          ),
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
