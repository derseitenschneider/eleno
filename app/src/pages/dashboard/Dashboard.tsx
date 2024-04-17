// import './dashboard.style.scss'

import DashboardSkeleton from '@/components/ui/skeletons/DashboardSkeleton.component'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import FooterDashboard from '../../components/features/dashboard/footer/FooterDashboard.component'
import HeaderDashboard from '../../components/features/dashboard/header/HeaderDashboard.component'
import News from '../../components/features/dashboard/news/News.component'
import Overview from '../../components/features/dashboard/overview/Overview.component'
import QuickLinks from '../../components/features/dashboard/quickLinks/QuickLinks.component'
import { useLoading } from '../../services/context/LoadingContext'
import useScrollTo from '@/hooks/useScrollTo'

function Dashboard() {
  const { isLoading } = useLoading()
  useScrollTo({ x: 0, y: 0 })
  if (isLoading) return <DashboardSkeleton />

  return (
    <motion.div
      className="grid grid-cols-3 gap-2"
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
