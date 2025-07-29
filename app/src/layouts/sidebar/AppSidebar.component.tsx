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
import { Link, useLocation } from 'react-router-dom'

import useTodosQuery from '@/components/features/todos/todosQuery'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Logo from '@/components/ui/Logo.component' // Assuming this path is correct
import useFeatureFlag from '@/hooks/useFeatureFlag'
import useNavigateToHolder from '@/hooks/useNavigateToHolder'
import { useLoading } from '@/services/context/LoadingContext'
import { useUser } from '@/services/context/UserContext'
import { cn } from '@/lib/utils'
import useMessagesQuery from '@/components/features/messages/messagesQueries'
import { useMessageNotification } from '@/hooks/useMessageNotification'

// A small helper component for the notification badges
const NavBadge = ({ count, color }: { count?: number; color?: string }) => {
  if (!count || count === 0) return null
  return (
    <div
      className={cn(
        'absolute right-3 top-1/2 -translate-y-1/2 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-medium text-destructive-foreground',
        color || 'bg-destructive',
      )}
    >
      {count}
    </div>
  )
}

export function AppSidebar() {
  const { user, logout } = useUser()
  const { isLoading } = useLoading()
  const { pathname } = useLocation()
  const { navigateToCurrentHolder } = useNavigateToHolder()

  const isPaymentFeatureEnabled = useFeatureFlag('stripe-payment')

  const { data: todos } = useTodosQuery()
  const { data: messages } = useMessagesQuery()

  const overdueTodosCount = todos?.filter(
    (todo) => todo.due && new Date(todo.due) <= new Date() && !todo.completed,
  ).length

  const unreadMessages = messages?.filter(
    (message) => message.status === 'sent',
  )
  useMessageNotification(unreadMessages) // Keep the toast notifications

  if (!user) {
    return null
  }

  const isActive = (path: string) => pathname.includes(path)
  const isHome = pathname === '/'

  return (
    <Sidebar collapsible='icon' variant='sidebar' className='hidden md:flex'>
      <SidebarContent className='flex flex-col'>
        <div className='mb-4 flex h-9 items-center justify-center p-2'>
          <Link to='/'>
            <Logo />
          </Link>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Dashboard */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={isHome}>
                  <Link to='/'>
                    <GaugeCircle strokeWidth={isHome ? 1.75 : 1.25} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Unterrichten */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={navigateToCurrentHolder}
                  disabled={isLoading}
                  active={isActive('/lessons')}
                  testId='lesson-nav-sidebar'
                >
                  <GraduationCap
                    strokeWidth={isActive('/lessons') ? 1.75 : 1.25}
                  />
                  <span>Unterrichten</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  active={
                    isActive('/students') && !pathname.includes('no-students')
                  }
                >
                  <Link to='/students'>
                    <Users
                      strokeWidth={isActive('/students') ? 1.75 : 1.25}
                    />
                    <span>Schüler:innen</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Todos */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  active={isActive('/todos')}
                  className='relative'
                >
                  <Link to='/todos'>
                    <CheckSquare2
                      strokeWidth={isActive('/todos') ? 1.75 : 1.25}
                    />
                    <span>Todos</span>
                    <NavBadge count={overdueTodosCount} />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Stundenplan */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild active={isActive('/timetable')}>
                  <Link to='/timetable'>
                    <CalendarDays
                      strokeWidth={isActive('/timetable') ? 1.75 : 1.25}
                    />
                    <span>Stundenplan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Group */}
        <div className='mt-auto'>
          <SidebarGroup>
            <SidebarGroupContent>
              {/* Nachrichten */}
              {isPaymentFeatureEnabled && (
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      active={isActive('/inbox')}
                      className='relative'
                    >
                      <Link to='/inbox'>
                        <Inbox
                          strokeWidth={isActive('/inbox') ? 1.75 : 1.25}
                        />
                        <span>Nachrichten</span>
                        <NavBadge
                          count={unreadMessages?.length}
                          color='bg-primary'
                        />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
              {/* Einstellungen */}
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    active={isActive('/settings')}
                    testId='sidebar-nav-settings'
                  >
                    <Link to='/settings'>
                      <Settings2
                        strokeWidth={isActive('/settings') ? 1.75 : 1.25}
                      />
                      <span>Einstellungen</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              {/* Anleitung */}
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      href='https://manual.eleno.net'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <BookOpen strokeWidth={1.25} />
                      <span>Anleitung</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              {/* Logout */}
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => logout()}>
                    <LogOut strokeWidth={1.25} />
                    <span>Log out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
