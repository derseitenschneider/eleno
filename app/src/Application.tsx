import { Outlet } from "react-router-dom"

import DataFetcher from "./DataFetcher.component"
import Sidebar from "./layouts/sidebar/Sidebar.component"

import NavbarMobile from "./layouts/navbarMobile/NavbarMobile.component"
import { DarkModeProvider } from "./services/context/DarkModeContext"
import { LoadingProvider } from "./services/context/LoadingContext"
import MainContext from "./services/context/MainContext"
import { AuthProvider } from "./services/context/UserContext"
import { UserLocaleProvider } from "./services/context/UserLocaleContext"
import { Toaster as Sonner } from "@/components/ui/sonner"

export default function Application() {
  return (
    <div>
      <UserLocaleProvider>
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
