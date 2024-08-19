import { Outlet } from 'react-router-dom'
import Navbar from '../../layouts/navbar/Navbar.component'
import { useLoading } from '@/services/context/LoadingContext'
import StudentsSkeleton from '@/components/ui/skeletons/StudentsSkeleton.component'

const navLinks = [
  { path: '', label: 'Aktive Schüler:innen', key: 1, end: true },
  { path: '/students/groups/', label: 'Gruppen', key: 2 },
  { path: '/students/archive/', label: 'Archiv', key: 3 },
]
export default function Students() {
  const { isLoading } = useLoading()

  if (isLoading) return <StudentsSkeleton />
  return (
    <div className='px-3 py-4 sm:*:px-5 sm:*:pr-4 max-h-full overflow-hidden sm:*:pl-8 pb-4 sm:py-5'>
      <header>
        <h1 className='heading-1'>Schüler:innen</h1>
      </header>
      <Navbar navLinks={navLinks} />
      <Outlet />
    </div>
  )
}
