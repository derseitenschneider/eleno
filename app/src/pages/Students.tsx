import StudentsSkeleton from '@/components/ui/skeletons/StudentsSkeleton.component'
import { useLoading } from '@/services/context/LoadingContext'
import { Outlet } from 'react-router-dom'
import Navbar from '../layouts/Navbar.component'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const navLinks = [
  { path: '', label: 'Schüler:innen', key: 1, end: true },
  { path: '/students/groups/', label: 'Gruppen', key: 2 },
  { path: '/students/archive/', label: 'Archiv', key: 3 },
]
export default function Students() {
  const { isLoading } = useLoading()

  if (isLoading) return <StudentsSkeleton />
  return (
    <ScrollArea className={cn('md:h-[calc(100vh-48px)]')}>
      <ScrollBar orientation='vertical' />
      <div className='px-3 py-4 pb-4 sm:px-0 sm:py-4 sm:*:px-4 sm:*:pl-6 sm:*:pr-4'>
        <Navbar navLinks={navLinks} />
        <Outlet />
      </div>
    </ScrollArea>
  )
}
