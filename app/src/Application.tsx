import { Outlet } from "react-router-dom"

import DataFetcher from "./DataFetcher.component"
import Sidebar from "./layouts/sidebar/Sidebar.component"

import NavbarMobile from "./layouts/navbarMobile/NavbarMobile.component"
import { DarkModeProvider } from "./services/context/DarkModeContext"
import { LoadingProvider } from "./services/context/LoadingContext"
import MainContext from "./services/context/MainContext"
import { AuthProvider } from "./services/context/UserContext"
import { Toaster } from "@/components/ui/sonner"

export default function Application() {
  return (
    <div>
      <LoadingProvider>
        <AuthProvider>
          <MainContext>
            <DataFetcher>
              <DarkModeProvider>
                <Sidebar />

                <NavbarMobile />
                <div className='md:ml-[50px] mb-[58px] md:mb-0'>
                  <Outlet />
                </div>
              </DarkModeProvider>
            </DataFetcher>
          </MainContext>
        </AuthProvider>
      </LoadingProvider>
      <Toaster position='top-right' />
    </div>
  )
}
