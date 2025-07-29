import { useLocation } from 'react-router-dom'
import useStudentsQuery from '@/components/features/students/studentsQueries'
import { useMemo } from 'react'

export type BreadcrumbItemType = {
  title: string
  href: string
}

// A mapping from path segments to friendlier names
const friendlyNames: Record<string, string> = {
  students: 'Schüler:innen & Gruppen',
  groups: 'Gruppen',
  settings: 'Einstellungen',
  todos: 'Todos',
  timetable: 'Stundenplan',
  lessons: 'Unterrichten',
  inbox: 'Nachrichten'
}

export function useBreadcrumbs() {
  const location = useLocation()
  const { data: students, isLoading } = useStudentsQuery()

  const breadcrumbs = useMemo(() => {
    const pathnames = location.pathname.split('/').filter((x) => x)

    // 1. Handle the root dashboard page
    if (pathnames.length === 0) {
      return [{ title: 'Dashboard', href: '/' }]
    }

    const primarySegment = pathnames[0]
    const secondarySegment = pathnames[1] // e.g., the ID from /students/123

    let title = friendlyNames[primarySegment] || primarySegment

    // You can add more rules for other dynamic paths here, e.g., for groups

    // 3. Return a single breadcrumb item acting as the page title
    return [{ title, href: location.pathname }]
  }, [location.pathname, students, isLoading])

  return breadcrumbs
}
