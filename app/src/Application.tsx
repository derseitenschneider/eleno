import { Outlet } from 'react-router-dom'

// Components
import Sidebar from './layouts/sidebar/Sidebar.component'
import Main from './layouts/main/Main.component'
import Toast from './components/_reusables/toast/Toast.component'

// Context provider
import MainContext from './contexts/MainContext'
import { AuthProvider } from './contexts/UserContext'
import { LoadingProvider } from './contexts/LoadingContext'
import NavbarMobile from './layouts/navbarMobile/NavbarMobile.component'

// [ ] add scroll up useEffect on all routes/pages

export default function Application() {
  return (
    <div className="App">
      <Toast />
      <LoadingProvider>
        <AuthProvider>
          <Sidebar />
          <NavbarMobile />
          <MainContext>
            <Main>
              <Outlet />
            </Main>
          </MainContext>
        </AuthProvider>
      </LoadingProvider>
    </div>
  )
}
