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
import useIsOnline from './hooks/useIsOnline'
import { cn } from './lib/utils'
import { SubscriptionProvider } from './services/context/SubscriptionContext'
import Banner from './components/ui/Banner.component'
import { NotificationManager } from './components/features/notifications/NotificationManager.component'
import { useEffect } from 'react'

export default function Application() {
  const isOnline = useIsOnline()
  return (
    <div
      className={cn(
        isOnline ? 'lg:before:h-[1px]' : 'lg:before:h-[0px]',
        'lg:before:z-[40] lg:before:w-screen lg:before:bg-hairline lg:before:fixed lg:before:top-0 lg:before:left-0',
      )}
    >
      <UserLocaleProvider>
        <LoadingProvider>
          <AuthProvider>
            <DataProvider>
              <SubscriptionProvider>
                <MainContext>
                  <DarkModeProvider>
                    <Banner />
                    <div className='md:ml-[50px]'>
                      <Outlet />
                    </div>
                    <Sidebar />
                    <NavbarMobile />
                    <NotificationManager />
                  </DarkModeProvider>
                </MainContext>
              </SubscriptionProvider>
            </DataProvider>
          </AuthProvider>
        </LoadingProvider>
      </UserLocaleProvider>
      <Sonner
        position='top-right'
        duration={2500}
        expand={true}
        toastOptions={{
          classNames: {
            toast: 'bg-background50 border-hairline',
            title: 'text-foreground',
            description: 'text-foreground/75',
            icon: 'text-foreground',
            actionButton: '!text-primary !bg-background50 hover:underline',
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
