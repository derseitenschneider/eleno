import { Outlet } from 'react-router-dom'

import DataProvider from './services/context/DataProvider.component'

import { Toaster as Sonner } from '@/components/ui/sonner'
import { Info } from 'lucide-react'
import { NotificationManager } from './components/features/notifications/NotificationManager.component'
import Banner from './components/ui/Banner.component'
import { SidebarProvider } from './components/ui/sidebar'
import { useOAuthTracker } from './hooks/useOAuthTracker'
import { AppHeader } from './layouts/appHeader/AppHeader'
import NavbarMobile from './layouts/navbarMobile/NavbarMobile.component'
import { AppSidebar } from './layouts/sidebar/AppSidebar.component'
import { DarkModeProvider } from './services/context/DarkModeContext'
import { LoadingProvider } from './services/context/LoadingContext'
import MainContext from './services/context/MainContext'
import { SubscriptionProvider } from './services/context/SubscriptionContext'
import { AuthProvider } from './services/context/UserContext'
import { UserLocaleProvider } from './services/context/UserLocaleContext'

export default function Application() {
  useOAuthTracker()

  return (
    <div>
      <UserLocaleProvider>
        <LoadingProvider>
          <AuthProvider>
            <DataProvider>
              <SubscriptionProvider>
                <MainContext>
                  <DarkModeProvider>
                    <Banner />
                    <SidebarProvider defaultOpen={false}>
                      <AppSidebar />
                      <main className='flex-1'>
                        <AppHeader />
                        <Outlet />
                      </main>
                      {/* <Sidebar /> */}
                    </SidebarProvider>
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
