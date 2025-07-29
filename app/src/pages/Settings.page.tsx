import { Outlet } from 'react-router-dom'
import Navbar from '../layouts/Navbar.component'
import useFeatureFlag from '@/hooks/useFeatureFlag'
import { useLoading } from '@/services/context/LoadingContext'

const navLinks = [
  { path: '', label: 'Benutzerkonto', key: 1, end: true },
  {
    path: 'subscription',
    label: 'Mein Abo',
    key: 2,
    testId: 'settings-nav-subscription',
  },
  { path: 'view', label: 'Ansicht', key: 3 },
]

function Settings() {
  const { isLoading } = useLoading()
  const isPaymentFeatureEnabled = useFeatureFlag('stripe-payment')
  let filteredNavlinks = navLinks

  if (!isPaymentFeatureEnabled) {
    filteredNavlinks = filteredNavlinks.filter(
      (link) => link.path !== 'subscription',
    )
  }

  if (isLoading) return <p>...loading</p>
  return (
    <div className='pb-20 sm:pb-[unset]'>
      <Navbar navLinks={filteredNavlinks} />
      <Outlet />
    </div>
  )
}

export default Settings
