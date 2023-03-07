import { NavLink } from 'react-router-dom'
import './dashboard.scss'
import { IoSchoolSharp, IoPeopleCircleOutline, IoList } from 'react-icons/io5'

function Dashboard() {
  return (
    <div className="dashboard">
      <header className="container container--header">
        <h1 className="heading-1">Dashboard</h1>
      </header>
      <div className="grid-container container">
        <NavLink to={'lessons'} className="card">
          <IoSchoolSharp className="icon" />
          <p className="card-title">Unterricht starten</p>
        </NavLink>
        <NavLink to={'students'} className="card">
          <IoPeopleCircleOutline className="icon" />
          <p className="card-title">Schüler:in hinzufügen</p>
        </NavLink>
        <NavLink to={'todos'} className="card">
          <IoList className="icon" />
          <p className="card-title">To Do erfassen</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Dashboard
