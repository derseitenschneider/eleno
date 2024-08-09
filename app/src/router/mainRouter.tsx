import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../pages/error/error'

import Loader from '../components/ui/loader/Loader'
import Application from '../Application'

import Account from '../pages/settings/Account'
import TodosCompleted from '../pages/todos/TodosCompleted.page'
import TodosOpen from '../pages/todos/TodosOpen.page'

import View from '../pages/settings/View'
import DashboardSkeleton from '@/components/ui/skeletons/DashboardSkeleton.component'
import Logout from '@/components/features/user/Logout.component'
import lessonsRoutes from './lessonsRouter'
import studentsRoutes from './studentsRouter'

const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const ToDos = lazy(() => import('../pages/todos/Todos.page'))
const Settings = lazy(() => import('../pages/settings/Settings'))
const Timetable = lazy(() => import('../pages/timetable/Timetable.page'))

const mainRouter = createBrowserRouter(
  [
    {
      path: '/',
      element: <Application />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<DashboardSkeleton />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: 'timetable',
          element: (
            <Suspense>
              <div className='py-5 pl-8 pr-4'>
                <Timetable />
              </div>
            </Suspense>
          ),
        },
        ...lessonsRoutes,
        ...studentsRoutes,
        {
          path: 'todos',
          element: (
            <Suspense fallback={<Loader loading />}>
              <div className='py-5 pl-8 pr-4'>
                <ToDos />
              </div>
            </Suspense>
          ),
          children: [
            { index: true, path: '', element: <TodosOpen /> },
            { path: 'completed', element: <TodosCompleted /> },
          ],
        },
        {
          path: 'settings',
          element: (
            <Suspense fallback={<Loader loading />}>
              <div className='py-5 pl-8 pr-4'>
                <Settings />
              </div>
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
        {
          path: 'logout',
          element: <Logout />,
        },
      ],
    },
  ],
  {
    basename: '/',
  },
)
export default mainRouter
