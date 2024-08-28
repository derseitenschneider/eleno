import { cn } from '@/lib/utils'
import { useState, type HTMLAttributeAnchorTarget } from 'react'
import { NavLink } from 'react-router-dom'

type TSidebarProps = {
  to?: string
  icon: React.ReactNode
  name: string
  target?: HTMLAttributeAnchorTarget
  sidebarOpen: boolean
  notificationContent?: number
  onClick?: () => void
  isButton?: boolean
  isActive?: boolean
}

export default function SidebarElement({
  to = '',
  onClick,
  icon,
  name,
  target,
  sidebarOpen,
  notificationContent,
  isButton = false,
  isActive = false,
}: TSidebarProps) {
  if (isButton)
    return (
      <li className='h-full w-full p-2'>
        <button
          className={cn(
            'align-center z-1 w-full relative flex items-center gap-4 p-1.5 text-foreground hover:no-underline ',
            'before:absolute before:left-0 before:top-0 before:z-[-1] before:size-full before:rounded-md before:hidden',
            'after:absolute after:left-0 after:top-0 after:z-[-1] after:h-full after:w-full after:rounded-md after:bg-transparent hover:after:bg-background50',
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
                : 'max-w-0 opacity-0 transition-none',
            )}
          >
            {name}
          </span>
        </button>
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
      <NavLink
        onClick={() => onClick?.()}
        title={name}
        to={to}
        target={target}
        className={cn(
          'align-center z-1 relative flex items-center gap-4 p-1.5 text-foreground',
          'before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-full before:rounded-md before:bg-primary/10',
          'after:absolute after:left-0 after:top-0 after:z-[-1] after:h-full after:w-full after:rounded-md after:bg-transparent',
          'hover:no-underline hover:after:bg-background50',
          isActive
            ? 'text-primary after:hidden'
            : 'text-foreground before:hidden',
        )}
      >
        <div className='relative z-10 h-full w-full max-w-[22px] shrink-0 *:h-full *:w-full'>
          {icon}
          {notificationContent ? (
            <div
              className='z-100 absolute bottom-0 right-0 flex
            aspect-square !size-[15px] translate-x-[25%] translate-y-[25%]
            items-center justify-center rounded-full bg-warning'
            >
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
              : 'max-w-0 opacity-0 transition-none',
          )}
        >
          {name}
        </span>
      </NavLink>
    </li>
  )
}
