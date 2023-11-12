import './headerDashboard.style.scss'
import { useUser } from '../../../contexts/UserContext'

function HeaderDashboard() {
  const { user } = useUser()
  const mode = import.meta.env.VITE_MODE

  return (
    <header className="header-dashboard">
      <h1 className="heading-1">Dashboard</h1>

      <div className="container-message">
        <span className="welcome-message">
          {mode === 'demo'
            ? 'Willkommen und viel Spass beim Ausprobieren der Demo!'
            : `Hi <b>${user.firstName}</b>, willkommen bei Eleno!`}
        </span>
      </div>
    </header>
  )
}

export default HeaderDashboard
