import './headerDashboard.style.scss'
import { useUser } from '../../../contexts/UserContext'

function HeaderDashboard() {
  const { user } = useUser()
  return (
    <header className="header-dashboard">
      <h1 className="heading-1">Dashboard</h1>

      <div className="container-message">
        <span className="welcome-message">
          Hi <b>{user.firstName}</b>, willkommen bei Eleno!
        </span>
      </div>
    </header>
  )
}

export default HeaderDashboard
