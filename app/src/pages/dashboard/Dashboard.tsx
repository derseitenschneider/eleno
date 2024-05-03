import DashboardSkeleton from "@/components/ui/skeletons/DashboardSkeleton.component"
import { motion } from "framer-motion"
import FooterDashboard from "../../components/features/dashboard/footer/FooterDashboard.component"
import HeaderDashboard from "../../components/features/dashboard/header/HeaderDashboard.component"
import News from "../../components/features/dashboard/news/News.component"
import Overview from "../../components/features/dashboard/overview/Overview.component"
import QuickLinks from "../../components/features/dashboard/quickLinks/QuickLinks.component"
import { useLoading } from "../../services/context/LoadingContext"
import useScrollTo from "@/hooks/useScrollTo"

function Dashboard() {
  const { isLoading } = useLoading()
  useScrollTo({ x: 0, y: 0 })
  if (isLoading) return <DashboardSkeleton />

  return (
    <motion.div
      className='h-screen min-h-[700px] grid grid-cols-[3fr_minmax(350px,_1fr)] grid-rows-[auto_auto_1fr_auto] *:p-7'
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
