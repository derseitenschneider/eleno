import { Outlet } from 'react-router-dom'

import DataProvider from './services/context/DataProvider.component'

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
import { useOAuthTracker } from './hooks/useOAuthTracker'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from './components/ui/sidebar'
import { AppHeader } from './layouts/appHeader/AppHeader'
import { AppSidebar } from './layouts/sidebar/AppSidebar.component'

export default function Application() {
  useOAuthTracker()
  const isOnline = useIsOnline()

  // return (
  //   <SidebarProvider defaultOpen={false}>
  //     <AppSidebar />
  //     <main className='flex-1'>
  //       <SidebarTrigger />
  //       <div>app</div>
  //     </main>
  //   </SidebarProvider>
  // )
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
