import { Outlet } from 'react-router-dom'

import Sidebar from '../../app/src/layouts/sidebar/Sidebar.component'
import Main from './components/Main.component'
import Toast from '../../app/src/components/common/toast/Toast.component'

import MainContext from '../../app/src/contexts/MainContext'

import NavbarMobile from '../../app/src/layouts/navbarMobile/NavbarMobile.component'

export default function Application() {
  return (
    <div className="App">
      <Toast />

      <Sidebar />
      <NavbarMobile />
      <MainContext>
        <Main>
          <Outlet />
        </Main>
      </MainContext>
    </div>
  )
}
