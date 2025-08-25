import {
  BookOpen,
  CalendarDays,
  CheckSquare2,
  ChevronsUpDown,
  GaugeCircle,
  GraduationCap,
  Inbox,
  LogOut,
  Settings2,
  Users,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import useMessagesQuery from '@/components/features/messages/messagesQueries'
import useTodosQuery from '@/components/features/todos/todosQuery'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LogoText from '@/components/ui/LogoText.component'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { UserInfo } from '@/components/ui/UserInfo.component'
import useFeatureFlag from '@/hooks/useFeatureFlag'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { useMessageNotification } from '@/hooks/useMessageNotification'
import useNavigateToHolder from '@/hooks/useNavigateToHolder'
import { cn } from '@/lib/utils'
import { useLoading } from '@/services/context/LoadingContext'
import { useUser } from '@/services/context/UserContext'

const NavBadge = ({ count, color }: { count?: number; color?: string }) => {
  const { open } = useSidebar()
  const isMobile = useIsMobileDevice()
  if (!count || count === 0) return null
  if (open || isMobile)
    return (
      <SidebarMenuBadge
        className={cn(
          '!top-[50%] translate-y-[-50%]',
          'rounded-full text-xs font-medium text-destructive-foreground',
          color || 'bg-destructive',
        )}
      >
        {count}
      </SidebarMenuBadge>
    )

  return (
    <div
      className={cn(
        'right-[8px] bottom-[12px] translate-y-[50%] size-[10px]',
        'absolute rounded-full',
        color || 'bg-destructive',
      )}
    />
  )
}

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar()
  const isMobile = useIsMobileDevice()
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

  function closeWhenMobile() {
    if (isMobile) {
      setOpenMobile(false)
    }
  }
  const isActive = (path: string) => pathname.includes(path)
  const isHome = pathname === '/'

  return (
    <Sidebar
      data-testid='app-sidebar'
      collapsible='icon'
      variant='sidebar'
      className='hidden md:flex'
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={closeWhenMobile} asChild>
              <Link to='/'>
                <LogoText />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className='flex flex-col'>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Dashboard */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={closeWhenMobile}
                  asChild
                  isActive={isHome}
                >
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
                  onClick={() => {
                    navigateToCurrentHolder()
                    closeWhenMobile()
                  }}
                  disabled={isLoading || undefined}
                  isActive={isActive('/lessons')}
                  data-testid='lesson-navigation'
                  autoFocus={false}
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
                  onClick={closeWhenMobile}
                  asChild
                  isActive={
                    isActive('/students') && !pathname.includes('no-students')
                  }
                >
                  <Link to='/students'>
                    <Users strokeWidth={isActive('/students') ? 1.75 : 1.25} />
                    <span>Schüler:innen & Gruppen</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Todos */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={closeWhenMobile}
                  isActive={isActive('/todos')}
                  className='relative'
                >
                  <Link to='/todos'>
                    <CheckSquare2
                      strokeWidth={isActive('/todos') ? 1.75 : 1.25}
                    />
                    <span>Todos</span>
                  </Link>
                </SidebarMenuButton>
                <NavBadge count={overdueTodosCount} />
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Stundenplan */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={closeWhenMobile}
                  asChild
                  isActive={isActive('/timetable')}
                >
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
      </SidebarContent>
      {/* Bottom Group */}
      <SidebarFooter>
        {/* Nachrichten */}
        {isPaymentFeatureEnabled && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={closeWhenMobile}
                asChild
                isActive={isActive('/inbox')}
                className='relative'
              >
                <Link to='/inbox'>
                  <Inbox strokeWidth={isActive('/inbox') ? 1.75 : 1.25} />
                  <span>Nachrichten</span>
                  <NavBadge count={unreadMessages?.length} color='bg-primary' />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
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
            <DropdownMenu>
              <SidebarMenuButton
                asChild
                size='lg'
                className='text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent group'
              >
                <DropdownMenuTrigger>
                  <UserInfo user={user} />
                  <ChevronsUpDown className='ml-auto size-3' />
                </DropdownMenuTrigger>
              </SidebarMenuButton>
              <DropdownMenuContent
                className='w-[var(--radix-popper-anchor-width)] min-w-56 rounded-lg'
                align='end'
                side={
                  isMobile
                    ? 'bottom'
                    : state === 'collapsed'
                      ? 'left'
                      : 'bottom'
                }
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <UserInfo user={user} showEmail={true} />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      className='block w-full text-foreground !no-underline'
                      to='/settings'
                      onClick={closeWhenMobile}
                    >
                      <Settings2 className='mr-2 !size-5' strokeWidth={1.25} />
                      Einstellungen
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className='text-foreground'>
                  <LogOut className='mr-2 !size-5' strokeWidth={1.25} />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
