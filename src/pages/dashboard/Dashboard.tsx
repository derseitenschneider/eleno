import { NavLink } from 'react-router-dom'
import './dashboard.scss'

function Dashboard() {
  return (
    <div>
      <header className="container container--header">
        <h1 className="heading-1">Dashboard</h1>
      </header>
      <div className="grid-container container">
        <NavLink to={'lessons'} className="card">
          <p className="card-title">Unterricht starten</p>
        </NavLink>
        <NavLink to={'students'} className="card">
          <p className="card-title">Schüler:in hinzufügen</p>
        </NavLink>
        <NavLink to={'todos'} className="card">
          <p className="card-title">To Do erfassen</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Dashboard
