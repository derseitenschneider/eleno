import { Outlet } from 'react-router-dom'

// Components
import Sidebar from './layouts/sidebar/Sidebar.component'
import Main from './components/main/Main.component'
import Toast from './components/toast/Toast.component'

// Context provider
import MainContext from './contexts/MainContext'
import { AuthProvider } from './contexts/UserContext'
import { LoadingProvider } from './contexts/LoadingContext'
import OfflineBanner from './components/offlineBanner/OfflineBanner.component'

// [ ] fix page refresh error

export default function Application() {
  return (
    <div className="App">
      <Toast />
      <LoadingProvider>
        <AuthProvider>
          <Sidebar />
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
