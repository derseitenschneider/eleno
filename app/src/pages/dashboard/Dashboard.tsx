import './dashboard.style.scss'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import FooterDashboard from '../../components/dashboard/footer/FooterDashboard.component'
import HeaderDashboard from '../../components/dashboard/header/HeaderDashboard.component'
import News from '../../components/dashboard/news/News.component'
import Overview from '../../components/dashboard/overview/Overview.component'
import QuickLinks from '../../components/dashboard/quickLinks/QuickLinks.component'
import { useLoading } from '../../contexts/LoadingContext'
import { useUser } from '../../contexts/UserContext'

function Dashboard() {
  const { user } = useUser()

  const { setLoading } = useLoading()

  useEffect(() => {
    if (user) setLoading(false)
  }, [user, setLoading])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
