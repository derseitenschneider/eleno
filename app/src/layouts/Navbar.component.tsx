import { cn } from '@/lib/utils'
import { NavLink } from 'react-router-dom'

type NavbarProps = {
  navLinks: {
    path: string
    testId?: string
    label: string
    key: number
    end?: boolean
  }[]
}

function Navbar({ navLinks }: NavbarProps) {
  return (
    <div className='text-base mb-6'>
      <ul className='p-0 flex justify-start gap-2'>
        {navLinks.map((link) => (
          <li key={link.key} className='px-1 relative overflow-hidden'>
            <NavLink
              data-testid={link.testId || ''}
              to={link.path}
              end={link.end}
              className={cn(
                'aria-[current=page]:border-b-4 border-primary',
                'text-foreground hover:no-underline',
              )}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Navbar
