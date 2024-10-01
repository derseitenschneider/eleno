import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../pages/Error'

import Application from '../Application'

import Account from '../components/features/settings/Account'
import TodosCompleted from '../components/features/todos/TodosCompleted.component'
import TodosOpen from '../components/features/todos/TodosOpen.component'

import View from '../components/features/settings/View'
import Logout from '@/components/features/user/Logout.component'
import lessonsRoutes from './lessonsRouter'
import studentsRoutes from './studentsRouter'
import { ScrollArea } from '@/components/ui/scroll-area'
import Dashboard from '@/pages/Dashboard'
import Todos from '@/pages/Todos.page'
import Timetable from '@/pages/Timetable.page'
import Settings from '@/pages/Settings.page'
import { cn } from '@/lib/utils'
import useHasBanner from '@/hooks/useHasBanner'

const TodosWrapper = () => {
  const hasBanner = useHasBanner()
  return (
    <ScrollArea
      className={cn(
        hasBanner ? 'mt-[32px] md:h-[calc(100vh-32px)]' : 'md:h-screen',
      )}
    >
      <div className='container-page'>
        <Todos />
      </div>
    </ScrollArea>
  )
}

const TimetableWrapper = () => {
  const hasBanner = useHasBanner()
  return (
    <ScrollArea
      className={cn(
        hasBanner ? 'mt-[32px] md:h-[calc(100vh-32px)]' : 'md:h-screen',
      )}
    >
      <div className='py-4 pl-6 pr-4'>
        <Timetable />
      </div>
    </ScrollArea>
  )
}

const SettingsWrapper = () => {
  const hasBanner = useHasBanner()
  return (
    <ScrollArea
      className={cn(
        hasBanner ? 'mt-[32px] md:h-[calc(100vh-32px)]' : 'md:h-screen',
      )}
    >
      <div className='container-page'>
        <Settings />
      </div>
    </ScrollArea>
  )
}

const mainRouter = createBrowserRouter(
  [
    {
      path: '/',
      element: <Application />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        ...lessonsRoutes,
        ...studentsRoutes,
        {
          path: 'todos',
          element: <TodosWrapper />,
          children: [
            { index: true, path: '', element: <TodosOpen /> },
            { path: 'completed', element: <TodosCompleted /> },
          ],
        },
        {
          path: 'timetable',
          element: <TimetableWrapper />,
        },
        {
          path: 'settings',
          element: <SettingsWrapper />,
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
        // {
        //   path: 'logout',
        //   element: <Logout />,
        // },
      ],
    },
  ],
  {
    basename: '/',
  },
)
export default mainRouter
