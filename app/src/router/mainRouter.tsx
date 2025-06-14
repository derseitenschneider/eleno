import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../pages/Error'

import Application from '../Application'

import Account from '../components/features/settings/Account'
import TodosCompleted from '../components/features/todos/TodosCompleted.component'
import TodosOpen from '../components/features/todos/TodosOpen.component'

import lessonsRoutes from './lessonsRouter'
import studentsRoutes from './studentsRouter'
import { ScrollArea } from '@/components/ui/scroll-area'
import Dashboard from '@/pages/Dashboard'
import Todos from '@/pages/Todos.page'
import Timetable from '@/pages/Timetable.page'
import Settings from '@/pages/Settings.page'
import { cn } from '@/lib/utils'
import useHasBanner from '@/hooks/useHasBanner'
import SubscriptionPage from '@/pages/Subscription.page'
import OnboardingPage from '@/pages/Onboarding.page'
import Inbox from '@/pages/Inbox.page'
import View from '@/components/features/settings/View'
import FirstStepsWizzard from '@/components/features/onboarding/FirstStepsWizzard.component'
import ProfileCard from '@/components/features/onboarding/ProfileCard.component'

const TodosWrapper = () => {
  const hasBanner = useHasBanner()
  return (
    <ScrollArea
      className={cn(
        hasBanner
          ? 'mt-[49px] md:mt-[28px] md:h-[calc(100vh-28px)]'
          : 'pb-20 sm:pb-[unset] md:h-screen',
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
        hasBanner ? 'mt-[32px] md:h-[calc(100vh-28px)]' : 'md:h-screen',
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
        hasBanner
          ? 'mt-[49px] sm:mt-[32px] md:h-[calc(100vh-28px)]'
          : 'md:h-screen',
      )}
    >
      <div className='container-page'>
        <Settings />
      </div>
    </ScrollArea>
  )
}
const InboxWrapper = () => {
  const hasBanner = useHasBanner()
  return (
    <div
      className={cn(
        'container-page h-full',
        hasBanner ? 'mt-[32px] md:h-[calc(100vh-28px)]' : 'md:h-screen',
      )}
    >
      <Inbox />
    </div>
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
          path: 'onboarding',
          element: <OnboardingPage />,
          children: [
            {
              index: true,
              path: '',
              element: <ProfileCard />,
            },
            { path: 'first-steps', element: <FirstStepsWizzard /> },
          ],
        },
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
              path: 'view',
              element: <View />,
            },
            {
              path: 'subscription',
              element: <SubscriptionPage />,
            },
          ],
        },
        {
          path: 'inbox',
          element: <InboxWrapper />,
        },
      ],
    },
  ],
  {
    basename: '/',
  },
)
export default mainRouter
