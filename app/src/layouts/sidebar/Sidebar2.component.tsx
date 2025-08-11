import { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'

import Logo from '../../components/ui/Logo.component'
import { useUser } from '../../services/context/UserContext'

import useMessagesQuery from '@/components/features/messages/messagesQueries'
import useTodosQuery from '@/components/features/todos/todosQuery'
import useFeatureFlag from '@/hooks/useFeatureFlag'
import useHasBanner from '@/hooks/useHasBanner'
import { useMessageNotification } from '@/hooks/useMessageNotification'
import useNavigateToHolder from '@/hooks/useNavigateToHolder'
import useOutsideClick from '@/hooks/useOutsideClick'
import SidebarElement from '@/layouts/sidebar/SidebarElement.component'
import SidebarToggle from '@/layouts/sidebar/SidebarToggle.component'
import { cn } from '@/lib/utils'
import { useLoading } from '@/services/context/LoadingContext'
import {
  BookOpen,
  CalendarDays,
  CheckSquare2,
  GaugeCircle,
  GraduationCap,
  Inbox,
  LogOut,
  Settings2,
  Users,
} from 'lucide-react'

function SidebarOld() {
  const isPaymentFlagEnabled = useFeatureFlag('stripe-payment')
  const { isLoading } = useLoading()
  const hasBanner = useHasBanner()
  const { user } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { navigateToCurrentHolder } = useNavigateToHolder()
  const todos = useTodosQuery().data
  const { data: messages } = useMessagesQuery()
  const { logout } = useUser()
  const overdueTodos = todos?.filter(
    (todo) => todo.due && todo?.due <= new Date() && !todo.completed,
  )

  const unreadMessages = messages?.filter(
    (message) => message.status === 'sent',
  )
  useMessageNotification(unreadMessages)

  const sidebarRef = useOutsideClick(() => setSidebarOpen(false))

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  if (!user) return null

  return (
    <nav
      ref={sidebarRef}
      className={cn(
        hasBanner
          ? 'lg:before:h-0 top-[28px] h-[calc(100vh-28px)]'
          : 'top-0 lg:before:h-[1px] h-screen',
        sidebarOpen ? 'w-[180px]' : 'w-[50px]',
        'hidden md:flex fixed left-0 z-[60] flex-col items-stretch justify-start bg-background100 shadow-lg realtive transition-width duration-150 ',
        'after:h-full after:w-[1px] after:z-[-1] after:bg-background200 after:absolute after:top-0 after:right-0 ',
        'lg:before:z-[40] lg:before:w-screen lg:before:bg-hairline lg:before:fixed lg:before:top-0 lg:before:left-0',
        'border-r border-hairline',
      )}
    >
      <SidebarToggle sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <NavLink
        to='/'
        onClick={() => setSidebarOpen(false)}
        className='block w-full'
      >
        <div className='mb-8 mt-3 flex items-center justify-center'>
          <Logo />
        </div>
      </NavLink>
      <ul className='flex flex-col items-center justify-between'>
        <SidebarElement
          isActive={window.location.pathname === '/'}
          sidebarOpen={sidebarOpen}
          onClick={() => setSidebarOpen(false)}
          to='/'
          name='Dashboard'
          icon={
            <GaugeCircle
              strokeWidth={window.location.pathname === '/' ? 1.55 : 1}
            />
          }
        />
        <SidebarElement
          isActive={window.location.pathname.includes('lessons')}
          testId={'lesson-nav-sidebar'}
          isButton
          disabled={isLoading || false}
          onClick={() => {
            navigateToCurrentHolder()
            setSidebarOpen(false)
          }}
          sidebarOpen={sidebarOpen}
          name='Unterrichten'
          icon={
            <GraduationCap
              strokeWidth={
                window.location.pathname.includes('lessons') ? 1.55 : 1
              }
            />
          }
        />
        <SidebarElement
          isActive={
            window.location.pathname.includes('students') &&
            !window.location.pathname.includes('no-')
          }
          onClick={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
          to='/students'
          name='Schüler:innen'
          icon={
            <Users
              strokeWidth={
                window.location.pathname.includes('students') ? 1.55 : 1
              }
            />
          }
        />
        <SidebarElement
          isActive={window.location.pathname.includes('todos')}
          onClick={() => setSidebarOpen(false)}
          notificationContent={overdueTodos?.length}
          sidebarOpen={sidebarOpen}
          to='/todos'
          name='Todos'
          icon={
            <CheckSquare2
              strokeWidth={
                window.location.pathname.includes('todos') ? 1.55 : 1
              }
            />
          }
        />
        <SidebarElement
          isActive={window.location.pathname.includes('timetable')}
          onClick={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
          to='/timetable'
          name='Stundenplan'
          icon={
            <CalendarDays
              strokeWidth={
                window.location.pathname.includes('timetable') ? 1.55 : 1
              }
            />
          }
        />
      </ul>

      <ul className='mt-auto flex flex-col items-center justify-between border-t border-background200'>
        {isPaymentFlagEnabled && (
          <SidebarElement
            isActive={window.location.pathname.includes('inbox')}
            onClick={() => setSidebarOpen(false)}
            sidebarOpen={sidebarOpen}
            notificationContent={unreadMessages?.length}
            notificationColor='bg-primary'
            to='/inbox'
            name='Nachrichten'
            icon={
              <Inbox
                strokeWidth={
                  window.location.pathname.includes('inbox') ? 1.55 : 1
                }
              />
            }
          />
        )}
        <SidebarElement
          testId='sidebar-nav-settings'
          isActive={window.location.pathname.includes('settings')}
          onClick={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
          to='/settings'
          name='Einstellungen'
          icon={
            <Settings2
              strokeWidth={
                window.location.pathname.includes('settings') ? 1.55 : 1
              }
            />
          }
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          onClick={() => setSidebarOpen(false)}
          to='https://manual.eleno.net'
          target={'_blank'}
          name='Anleitung'
          icon={<BookOpen strokeWidth={1} />}
        />
        <SidebarElement
          isButton
          onClick={() => logout()}
          sidebarOpen={sidebarOpen}
          name='Log out'
          icon={<LogOut strokeWidth={1} />}
        />
      </ul>
    </nav>
  )
}

export default SidebarOld
