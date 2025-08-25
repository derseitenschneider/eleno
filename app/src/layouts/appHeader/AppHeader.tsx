import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs' // Import the new hook
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { cn } from '@/lib/utils'
import SubscriptionStatusBadge from './SubscriptionStatusBadge.component'

export function AppHeader() {
  const breadcrumbs = useBreadcrumbs()
  const isMobile = useIsMobileDevice()

  return (
    <header className='sticky top-0 z-[50] flex h-12 items-center justify-between border-b border-hairline bg-background100 px-4 sm:pl-6'>
      <SidebarTrigger
        data-testid='sidebar-trigger'
        className={cn(
          isMobile ? 'size-5' : 'size-4',
          'flex sm:hidden lg:flex hover:bg-background50',
        )}
      />
      {breadcrumbs.length > 0 && (
        <div className='absolute left-1/2 top-[calc(50%+1px)] -translate-x-1/2  -translate-y-1/2 sm:left-0 sm:translate-x-[23px] lg:translate-x-[46px]'>
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1
                return (
                  <Fragment key={`${item.title}-${item.href}`}>
                    <BreadcrumbItem className=' text-sm sm:text-base'>
                      {isLast ? (
                        <BreadcrumbPage className='font-medium sm:font-normal'>
                          {item.title}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={item.href}>{item.title}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}
      <SubscriptionStatusBadge />
    </header>
  )
}
