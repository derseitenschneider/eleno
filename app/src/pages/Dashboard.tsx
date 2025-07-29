import DashboardSkeleton from '@/components/ui/skeletons/DashboardSkeleton.component'
import useScrollTo from '@/hooks/useScrollTo'
import FooterDashboard from '../components/features/dashboard/FooterDashboard.component'
import HeaderDashboard from '../components/features/dashboard/HeaderDashboard.component'
import News from '../components/features/dashboard/news/News.component'
import Overview from '../components/features/dashboard/overview/Overview.component'
import QuickLinks from '../components/features/dashboard/quickLinks/QuickLinks.component'
import { useLoading } from '../services/context/LoadingContext'
import { cn } from '@/lib/utils'
import useHasBanner from '@/hooks/useHasBanner'

function Dashboard() {
  const { isLoading } = useLoading()
  const hasBanner = useHasBanner()
  useScrollTo()

  if (isLoading) return <DashboardSkeleton />

  return (
    <div
      className={cn(
        'md:h-[calc(100vh-48px)] md:min-h-[700px] min-[900px]:grid grid-cols-[3fr_minmax(350px,_1fr)] grid-rows-[auto_auto_1fr_auto]',
      )}
    >
      <HeaderDashboard />
      <QuickLinks />
      <Overview />
      <News />
      <FooterDashboard />
    </div>
  )
}

export default Dashboard
