import './dashboard.style.scss'

import { useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useLoading } from '../../contexts/LoadingContext'
import News from '../../components/dashboard/news/News.component'
import FooterDashboard from '../../components/dashboard/footer/FooterDashboard.component'
import QuickLinks from '../../components/dashboard/quickLinks/QuickLinks.component'
import Overview from '../../components/dashboard/overview/Overview.component'
import HeaderDashboard from '../../components/dashboard/header/HeaderDashboard.component'
import { motion } from 'framer-motion'

function Dashboard() {
  const { user } = useUser()

  const { setLoading } = useLoading()

  useEffect(() => {
    user && setLoading(false)
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
