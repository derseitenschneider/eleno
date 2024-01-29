import './headerDashboard.style.scss'
import { useUser } from '../../../../services/context/UserContext'
import DarkmodeToggle from '../../../ui/darkmodeToggle/DarkmodeToggle.component'

function HeaderDashboard() {
  const { user } = useUser()
  const mode = import.meta.env.VITE_MODE

  return (
    <header className="header-dashboard">
      <h1 className="heading-1">Dashboard</h1>

      <div className="container-message">
        {mode === 'demo' ? (
          <span className="welcome-message">
            Willkommen und viel Spass beim Ausprobieren der Demo!
          </span>
        ) : (
          <span className="welcome-message">
            Hi <b>{user.firstName}</b>, willkommen bei Eleno!
          </span>
        )}
      </div>
      <div className="controlls-darkmode">
        <DarkmodeToggle />
      </div>
    </header>
  )
}

export default HeaderDashboard
