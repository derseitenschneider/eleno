import { Fragment } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Link } from 'react-router-dom'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs' // Import the new hook

export function AppHeader() {
  const breadcrumbs = useBreadcrumbs()

  return (
    <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b border-hairline bg-background100 px-4">
      <SidebarTrigger />
      {breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <Fragment key={`${item.title}-${item.href}`}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.title}</BreadcrumbPage>
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
      )}
    </header>
  )
}
