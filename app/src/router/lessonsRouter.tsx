import LessonHeader from "@/components/features/lessons/LessonHeader"
import AllLessons from "@/components/features/lessons/allLessons/AllLessons.component"
import Repertoire from "@/components/features/repertoire/Repertoire.component"
import { motion } from "framer-motion"
import { Suspense, lazy } from "react"
import { Outlet } from "react-router-dom"

const LessonsPage = lazy(() => import("../pages/Lessons.page"))

const lessonsRoutes = [
  {
    path: "/lessons/:studentId",
    element: (
      <Suspense fallback={<p>...loading</p>}>
        {/* <LessonSkeleton /> */}
        <motion.div
          className='h-screen grid grid-cols-[1fr_400px] grid-rows-[auto_1fr]'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LessonHeader />
          <Outlet />
        </motion.div>
      </Suspense>
    ),
    children: [
      {
        path: "",
        isindex: true,
        element: <LessonsPage />,
      },
      {
        path: "all",
        element: <AllLessons />,
      },
    ],
  },
  {
    path: "/lessons/all",
    element: <AllLessons />,
  },
  {
    path: "/lessons/repertoire",
    element: <Repertoire />,
  },
]
export default lessonsRoutes
