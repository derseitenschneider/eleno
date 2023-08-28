import './dashboard.style.scss'

import { useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useLoading } from '../../contexts/LoadingContext'
import News from '../../components/news/News.component'
import FooterDashboard from '../../components/dashboard/footer/FooterDashboard.component'
import QuickLinks from '../../components/dashboard/quickLinks/QuickLinks.component'
import Overview from '../../components/dashboard/overview/Overview.component'
import HeaderDashboard from '../../components/dashboard/header/HeaderDashboard.component'

function Dashboard() {
  const { user } = useUser()

  const { loading, setLoading } = useLoading()

  useEffect(() => {
    user && setLoading(false)
  }, [user, setLoading])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="dashboard">
      <HeaderDashboard />

      <QuickLinks />
      <Overview />

      <News />

      <FooterDashboard />
    </div>
  )
}

export default Dashboard
