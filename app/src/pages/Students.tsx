import StudentsSkeleton from '@/components/ui/skeletons/StudentsSkeleton.component'
import { useLoading } from '@/services/context/LoadingContext'
import { Outlet } from 'react-router-dom'
import Navbar from '../layouts/Navbar.component'

const navLinks = [
  { path: '', label: 'Schüler:innen', key: 1, end: true },
  { path: '/students/groups/', label: 'Gruppen', key: 2 },
  { path: '/students/archive/', label: 'Archiv', key: 3 },
]
export default function Students() {
  const { isLoading } = useLoading()

  if (isLoading) return <StudentsSkeleton />
  return (
    <div className='px-3 sm:px-0 py-4 sm:*:px-4 sm:*:pr-4 max-h-full overflow-hidden sm:*:pl-6 pb-4 sm:py-4'>
      <header>
        <h1 className='heading-1'>Schüler:innen</h1>
      </header>
      <Navbar navLinks={navLinks} />
      <Outlet />
    </div>
  )
}
