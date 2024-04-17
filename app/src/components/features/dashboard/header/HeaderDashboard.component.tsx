import { useUser } from '../../../../services/context/UserContext'
import DarkmodeToggle from '../../../ui/darkmodeToggle/DarkmodeToggle.component'

function HeaderDashboard() {
  const { user } = useUser()
  const mode = import.meta.env.VITE_MODE

  return (
    <header className="col-span-3 flex justify-between">
      <div className="left">
        <h1>Dashboard</h1>

        <div className="">
          {mode === 'demo' ? (
            <span className="">
              Willkommen und viel Spass beim Ausprobieren der Demo!
            </span>
          ) : (
            <span className="">
              Hi <b>{user?.firstName}</b>, willkommen bei Eleno!
            </span>
          )}
        </div>
      </div>
      <div className="">
        <DarkmodeToggle />
      </div>
    </header>
  )
}

export default HeaderDashboard
