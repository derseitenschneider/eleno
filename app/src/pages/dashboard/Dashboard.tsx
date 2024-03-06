import './dashboard.style.scss'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import FooterDashboard from '../../components/features/dashboard/footer/FooterDashboard.component'
import HeaderDashboard from '../../components/features/dashboard/header/HeaderDashboard.component'
import News from '../../components/features/dashboard/news/News.component'
import Overview from '../../components/features/dashboard/overview/Overview.component'
import QuickLinks from '../../components/features/dashboard/quickLinks/QuickLinks.component'
import { useLoading } from '../../services/context/LoadingContext'
import { useUser } from '../../services/context/UserContext'
import DashboardSkeleton from '@/components/ui/skeletons/DashboardSkeleton.component'

function Dashboard() {
  const { user } = useUser()

  const { isLoading } = useLoading()

  // useEffect(() => {
  //   if (user) setLoading(false)
  // }, [user, setLoading])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (isLoading) return <DashboardSkeleton />

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <HeaderDashboard />

      <QuickLinks />
      <Overview />

      <News />

      <FooterDashboard />
    </motion.div>
  )
}

export default Dashboard
