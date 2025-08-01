import { useLocation } from 'react-router-dom'
import useStudentsQuery from '@/components/features/students/studentsQueries'
import { useMemo } from 'react'

export type BreadcrumbItemType = {
  title: string
  href: string
}

const friendlyNames: Record<string, string> = {
  students: 'Schüler & Gruppen',
  groups: 'Gruppen',
  settings: 'Einstellungen',
  todos: 'Todos',
  timetable: 'Stundenplan',
  lessons: 'Unterrichten',
  inbox: 'Nachrichten',
}

export function useBreadcrumbs() {
  const location = useLocation()
  // const { data: students, isLoading } = useStudentsQuery()

  const breadcrumbs = useMemo(() => {
    const pathnames = location.pathname.split('/').filter((x) => x)

    if (pathnames.length === 0) {
      return [{ title: 'Dashboard', href: '/' }]
    }

    const primarySegment = pathnames[0] || ''

    const title = friendlyNames[primarySegment] || primarySegment

    return [{ title, href: location.pathname }]
  }, [location.pathname])

  return breadcrumbs
}
