import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { HTMLAttributeAnchorTarget } from 'react'
import { NavLink } from 'react-router-dom'

type TSidebarProps = {
  to?: string
  disabled?: boolean
  testId?: string
  children?: React.ReactNode
  icon?: React.ReactNode
  name: string
  target?: HTMLAttributeAnchorTarget
  sidebarOpen: boolean
  notificationContent?: number
  notificationColor?: string
  onClick?: () => void
  isButton?: boolean
  isActive?: boolean
}

export default function SidebarElement({
  testId = '',
  disabled = false,
  to = '',
  onClick,
  icon,
  children,
  name,
  target,
  sidebarOpen,
  notificationContent,
  isButton = false,
  isActive = false,
  notificationColor = 'bg-warning',
}: TSidebarProps) {
  if (children)
    return (
      <li
        className={cn(
          'size-full p-2 relative',
          isActive && !sidebarOpen
            ? 'before:h-[calc(100%-12px)] before:w-[1px] before:absolute before:bg-primary before:right-0 before:top-[6px]'
            : '',
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className='w-full'>{children}</TooltipTrigger>
            <TooltipContent side='right' hidden={sidebarOpen}>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </li>
    )

  if (isButton)
    return (
      <li
        className={cn(
          'size-full p-2 relative',
          isActive && !sidebarOpen
            ? 'before:h-[calc(100%-12px)] before:w-[1px] before:absolute before:bg-primary before:right-0 before:top-[6px]'
            : '',
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              disabled={disabled}
              data-testid={testId}
              className={cn(
                'align-center z-1 w-full relative flex items-center gap-4 p-1.5 text-foreground hover:no-underline ',
                'before:absolute before:left-0 before:top-0 before:z-[-1] before:size-full before:rounded-md before:bg-primary/20',
                'after:absolute after:left-0 after:top-0 after:z-[-1] after:h-full after:w-full after:rounded-md after:bg-transparent hover:after:bg-background50',
                isActive
                  ? 'text-primary after:hidden'
                  : 'text-foreground before:hidden',
              )}
              type='button'
              onClick={() => onClick?.()}
            >
              <div className='relative z-10 h-full w-full max-w-[22px] shrink-0 *:h-full *:w-full'>
                {icon}
              </div>
              <span
                className={cn(
                  'whitespace-nowrap text-sm leading-none',
                  isActive && 'text-primary font-medium',
                  sidebarOpen
                    ? 'opacity-100 max-w-[200px] transition-all duration-200 delay-100'
                    : 'max-w-0 pointer-events-none opacity-0 transition-none',
                )}
              >
                {name}
              </span>
            </TooltipTrigger>
            <TooltipContent side='right' hidden={sidebarOpen}>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </li>
    )

  return (
    <li
      className={cn(
        'size-full p-2 relative',
        isActive && !sidebarOpen
          ? 'before:h-[calc(100%-12px)] before:w-[1px] before:absolute before:bg-primary before:right-0 before:top-[6px]'
          : '',
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className='w-full'>
            <NavLink
              data-testid={testId}
              onClick={() => onClick?.()}
              title={name}
              to={to}
              target={target}
              className={cn(
                'align-center z-1 relative flex items-center gap-4 p-1.5 text-foreground',
                'before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-full before:rounded-md before:bg-primary/20',
                'after:absolute after:left-0 after:top-0 after:z-[-1] after:h-full after:w-full after:rounded-md after:bg-transparent',
                'hover:no-underline hover:after:bg-background50',
                isActive
                  ? 'text-primary after:hidden'
                  : 'text-foreground before:hidden',
              )}
            >
              <div className='relative z-10 h-full w-full max-w-[20px] shrink-0 *:h-full *:w-full'>
                {icon}
                {notificationContent ? (
                  <div
                    className={cn(
                      'z-100 absolute bottom-0 right-0 flex aspect-square !size-[15px] translate-x-[25%] translate-y-[25%] items-center justify-center rounded-full',
                      notificationColor,
                    )}
                  >
                    {' '}
                    <span className='text-[10px] text-white'>
                      {notificationContent}
                    </span>
                  </div>
                ) : null}
              </div>
              <span
                className={cn(
                  'whitespace-nowrap text-sm leading-none',
                  isActive && 'text-primary font-medium',
                  sidebarOpen
                    ? 'opacity-100 max-w-[200px] transition-all duration-200 delay-100'
                    : 'max-w-0 pointer-events-none opacity-0 transition-none',
                )}
              >
                {name}
              </span>
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side='right' hidden={sidebarOpen}>
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  )
}
