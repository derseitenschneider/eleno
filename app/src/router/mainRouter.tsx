import { createBrowserRouter } from 'react-router-dom'
import FirstStepsWizzard from '@/components/features/onboarding/FirstStepsWizzard.component'
import PasswordCard from '@/components/features/onboarding/PasswordCard.component'
import ProfileCard from '@/components/features/onboarding/ProfileCard.component'
import View from '@/components/features/settings/View'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import Dashboard from '@/pages/Dashboard'
import Inbox from '@/pages/Inbox.page'
import OnboardingPage from '@/pages/Onboarding.page'
import Settings from '@/pages/Settings.page'
import SubscriptionPage from '@/pages/Subscription.page'
import Timetable from '@/pages/Timetable.page'
import Todos from '@/pages/Todos.page'
import Application from '../Application'
import Account from '../components/features/settings/Account'
import TodosCompleted from '../components/features/todos/TodosCompleted.component'
import TodosOpen from '../components/features/todos/TodosOpen.component'
import ErrorPage from '../pages/Error'
import lessonsRoutes from './lessonsRouter'
import studentsRoutes from './studentsRouter'

const TodosWrapper = () => {
  return (
    <ScrollArea className={cn('md:h-[calc(100vh-48px)] ')}>
      <div className='container-page'>
        <Todos />
      </div>
    </ScrollArea>
  )
}

const TimetableWrapper = () => {
  return (
    <ScrollArea className={cn('md:h-[calc(100vh-48px)]')}>
      <div className='py-4 pl-6 pr-4'>
        <Timetable />
      </div>
    </ScrollArea>
  )
}

const SettingsWrapper = () => {
  return (
    <ScrollArea className={cn('md:h-[calc(100vh-48px)]')}>
      <div className='container-page'>
        <Settings />
      </div>
    </ScrollArea>
  )
}
const InboxWrapper = () => {
  return (
    <div className={cn('container-page h-full md:h-[calc(100vh-48px)]')}>
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
              path: 'profile',
              element: <ProfileCard />,
            },
            {
              path: 'password',
              element: <PasswordCard />,
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
