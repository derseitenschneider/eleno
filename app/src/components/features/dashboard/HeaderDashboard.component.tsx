import { cn } from '@/lib/utils'
import { useUser } from '../../../services/context/UserContext'
import DarkmodeToggle from '../../ui/DarkmodeToggle.component'
import { appConfig } from '@/config'

function HeaderDashboard() {
  const { user } = useUser()

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
        <h1 data-testid='dashboard-heading'>Dashboard</h1>

        <div>
          {appConfig.isDemoMode ? (
            <span className=''>
              Willkommen bei der Demo von <b>Eleno</b>!{' '}
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
