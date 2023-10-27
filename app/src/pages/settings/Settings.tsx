import { Outlet } from 'react-router-dom'
import Navbar from '../../layouts/navbar/Navbar.component'

const navLinks = [{ path: '', label: 'Benutzerkonto', key: 1, end: true }]

function Settings() {
  return (
    <div className="container container--settings">
      <h1 className="heading-1">Einstellungen</h1>
      <Navbar navLinks={navLinks} />
      <Outlet />
    </div>
  )
}

export default Settings
