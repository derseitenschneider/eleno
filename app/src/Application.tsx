import { Outlet } from "react-router-dom"

import DataProvider from "./DataProvider.component"
import Sidebar from "./layouts/sidebar/Sidebar.component"

import NavbarMobile from "./layouts/navbarMobile/NavbarMobile.component"
import { DarkModeProvider } from "./services/context/DarkModeContext"
import { LoadingProvider } from "./services/context/LoadingContext"
import { AuthProvider } from "./services/context/UserContext"
import { UserLocaleProvider } from "./services/context/UserLocaleContext"
import { Toaster as Sonner } from "@/components/ui/sonner"
import MainContext from "./services/context/MainContext"

export default function Application() {
  return (
    <div>
      <UserLocaleProvider>
        <LoadingProvider>
          <AuthProvider>
            <DataProvider>
              <MainContext>
                <DarkModeProvider>
                  <Sidebar />
                  <NavbarMobile />
                  <div className='md:ml-[50px] mb-[58px] md:mb-0'>
                    <Outlet />
                  </div>
                </DarkModeProvider>
              </MainContext>
            </DataProvider>
          </AuthProvider>
        </LoadingProvider>
      </UserLocaleProvider>
      <Sonner
        position='top-right'
        toastOptions={{
          classNames: {
            toast: "bg-background50 border-hairline",
            title: "text-foreground",
            icon: "text-foreground",
          },
        }}
      />
    </div>
  )
}
