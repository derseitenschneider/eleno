import { cn } from '@/lib/utils'
import { NavLink, useLocation } from 'react-router-dom'

type NavbarMobileItemProps = {
  to?: string
  icon: React.ReactNode
  notificationContent?: number
  isButton?: boolean
  onClick?: () => void
  isActive?: boolean
}
export default function NavbarMobileItem({
  to = '',
  icon,
  notificationContent,
  isButton = false,
  onClick,
  isActive = false,
}: NavbarMobileItemProps) {
  if (isButton)
    return (
      <li>
        <button
          className={`${isActive ? 'text-white' : 'text-foreground'
            } block size-[32] p-[6px] relative`}
          type='button'
          onClick={() => onClick?.()}
        >
          {icon}
        </button>
      </li>
    )

  return (
    <li
      className={cn(
        'relative',
        isActive &&
        'before:absolute before:w-[105%] before:h-[1.5px] before:bg-primary before:top-[-9.5px] before:z-10 before:left-[50%] before:translate-x-[-50%]',
      )}
    >
      <NavLink
        to={to}
        className={cn(
          'text-foreground block size-[40px] p-[6px] relative',
          isActive && 'text-primary',
        )}
      >
        <span
          className={`${isActive ? 'block' : 'hidden'
            } absolute top-0 left-0 size-full bg-primary/10 z-[-1] rounded-md`}
        />
        {icon}
        {notificationContent ? (
          <div
            className='z-100 absolute bottom-0 right-0 flex aspect-square 
            !size-[16px] items-center justify-center rounded-full bg-warning'
          >
            <span className='text-[10px] text-white'>
              {notificationContent}
            </span>
          </div>
        ) : null}
      </NavLink>
    </li>
  )
}
