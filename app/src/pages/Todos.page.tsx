import { Outlet } from 'react-router-dom'
import Navbar from '../layouts/Navbar.component'

function Todos() {
  return (
    <div className='pb-24 sm:pb-0'>
      <Navbar
        navLinks={[
          { path: '', label: 'Offen', key: 0, end: true },
          { path: 'completed', label: 'Erledigt', key: 1, end: true },
        ]}
      />
      <Outlet />
    </div>
  )
}
export default Todos
