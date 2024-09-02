import { Outlet } from 'react-router-dom'

import DataProvider from './services/context/DataProvider.component'
import Sidebar from './layouts/sidebar/Sidebar.component'

import NavbarMobile from './layouts/navbarMobile/NavbarMobile.component'
import { DarkModeProvider } from './services/context/DarkModeContext'
import { LoadingProvider } from './services/context/LoadingContext'
import { AuthProvider } from './services/context/UserContext'
import { UserLocaleProvider } from './services/context/UserLocaleContext'
import { Toaster as Sonner } from '@/components/ui/sonner'
import MainContext from './services/context/MainContext'
import { Info } from 'lucide-react'
import { useEffect } from 'react'

export default function Application() {
  useEffect(() => {
    const loader = document.getElementById('loader')
    if (loader) {
      setTimeout(() => {
        loader.classList.add('fade-out')
        setTimeout(() => {
          loader.style.display = 'none'
        }, 1000)
      }, 2000)
    }
  }, [])
  return (
    <div className='md:before:h-[1px] md:before:z-[40] md:before:w-screen md:before:bg-hairline md:before:fixed md:before:top-0 md:before:left-0'>
      <UserLocaleProvider>
        <LoadingProvider>
          <AuthProvider>
            <DataProvider>
              <MainContext>
                <DarkModeProvider>
                  <div className='md:ml-[50px] mb-[58px] md:mb-0'>
                    <Outlet />
                  </div>
                  <Sidebar />
                  <NavbarMobile />
                </DarkModeProvider>
              </MainContext>
            </DataProvider>
          </AuthProvider>
        </LoadingProvider>
      </UserLocaleProvider>
      <Sonner
        position='top-right'
        duration={2500}
        toastOptions={{
          classNames: {
            toast: 'bg-background50 border-hairline',
            title: 'text-foreground',
            icon: 'text-foreground',
            closeButton:
              'text-foreground/50 bg-background50 border-foreground/30 size-4 hover:!bg-background50 hover:text-foreground/50 hover:!border-foreground/30',
          },
        }}
        icons={{
          info: <Info />,
        }}
      />
    </div>
  )
}
