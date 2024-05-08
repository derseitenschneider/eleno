import { Outlet } from "react-router-dom"

import Toast from "./components/ui/toast/Toast.component"
import Sidebar from "./layouts/sidebar/Sidebar.component"
import Main from "./layouts/main/Main.component"

import MainContext from "./services/context/MainContext"
import { AuthProvider } from "./services/context/UserContext"
import { LoadingProvider } from "./services/context/LoadingContext"
import NavbarMobile from "./layouts/navbarMobile/NavbarMobile.component"
import { DarkModeProvider } from "./services/context/DarkModeContext"

export default function Application() {
  return (
    <div>
      <Toast />
      <LoadingProvider>
        <AuthProvider>
          <MainContext>
            <Main>
              <DarkModeProvider>
                <Sidebar />

                <NavbarMobile />
                <div className='md:ml-[50px] mb-[58px] md:mb-0'>
                  <Outlet />
                </div>
              </DarkModeProvider>
            </Main>
          </MainContext>
        </AuthProvider>
      </LoadingProvider>
    </div>
  )
}
