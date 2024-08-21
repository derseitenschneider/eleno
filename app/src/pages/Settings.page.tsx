import { Outlet } from 'react-router-dom'
import Navbar from '../layouts/Navbar.component'

const navLinks = [
  { path: '', label: 'Benutzerkonto', key: 1, end: true },
  { path: 'view', label: 'Ansicht', key: 2 },
]

function Settings() {
  return (
    <div>
      <h1 className='heading-1'>Einstellungen</h1>
      <Navbar navLinks={navLinks} />
      <Outlet />
    </div>
  )
}

export default Settings
