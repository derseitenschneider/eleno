import { Outlet } from 'react-router-dom'

import Sidebar from './layouts/sidebar/Sidebar.component'
import Main from './layouts/main/Main.component'
import Toast from './components/ui/toast/Toast.component'

import MainContext from './services/context/MainContext'
import { AuthProvider } from './services/context/UserContext'
import { LoadingProvider } from './services/context/LoadingContext'
import NavbarMobile from './layouts/navbarMobile/NavbarMobile.component'

export default function Application() {
  return (
    <div className="App">
      <Toast />
      <LoadingProvider>
        <AuthProvider>
          <MainContext>
            <Sidebar />
            <NavbarMobile />
            <Main>
              <Outlet />
            </Main>
          </MainContext>
        </AuthProvider>
      </LoadingProvider>
    </div>
  )
}
