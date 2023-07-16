import { Outlet } from 'react-router-dom'

import Navbar from '../../layouts/navbar/Navbar.component'
function Todos() {
  return (
    <div className="container">
      <h1 className="heading-1">Todos</h1>

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
