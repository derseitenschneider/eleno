import { cn } from '@/lib/utils'
import { useUser } from '../../../services/context/UserContext'
import DarkmodeToggle from '../../ui/DarkmodeToggle.component'

function HeaderDashboard() {
  const { user } = useUser()
  const mode = import.meta.env.VITE_MODE

  return (
    <header
      className={cn(
        'px-5 py-6 sm:py-6',
        'md:p-6',
        'lg:p-4 lg:pl-6',
        'col-span-2 flex justify-between border-b border-hairline',
      )}
    >
      <div>
        <h1>Dashboard</h1>

        <div>
          {mode === 'demo' ? (
            <span className=''>
              Willkommen und viel Spass beim Ausprobieren der Demo.
            </span>
          ) : (
            <span className=''>
              Hi <b>{user?.first_name}</b>, willkommen bei Eleno!
            </span>
          )}
        </div>
      </div>
      <div className=''>
        <DarkmodeToggle />
      </div>
    </header>
  )
}

export default HeaderDashboard