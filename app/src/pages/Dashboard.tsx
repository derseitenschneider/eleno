import DashboardSkeleton from "@/components/ui/skeletons/DashboardSkeleton.component";
import useScrollTo from "@/hooks/useScrollTo";
import { motion } from "framer-motion";
import FooterDashboard from "../components/features/dashboard/FooterDashboard.component";
import HeaderDashboard from "../components/features/dashboard/HeaderDashboard.component";
import News from "../components/features/dashboard/news/News.component";
import Overview from "../components/features/dashboard/overview/Overview.component";
import QuickLinks from "../components/features/dashboard/quickLinks/QuickLinks.component";
import { useLoading } from "../services/context/LoadingContext";

function Dashboard() {
  const { isLoading } = useLoading();
  useScrollTo();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <motion.div
      className="md:h-screen md:min-h-[700px] min-[900px]:grid grid-cols-[3fr_minmax(350px,_1fr)]
      grid-rows-[auto_auto_1fr_auto]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <HeaderDashboard />
      <QuickLinks />
      <Overview />
      <News />
      <FooterDashboard />
    </motion.div>
  );
}

export default Dashboard;