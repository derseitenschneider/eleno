import AllLessons from "@/components/features/lessons/allLessons/AllLessons.component"
import Repertoire from "@/components/features/repertoire/Repertoire.component"
import { Suspense, lazy } from "react"

const LessonsPage = lazy(() => import("../pages/Lessons.page"))

const lessonsRoutes = [
  {
    path: "/lessons/:studentId",
    element: (
      <Suspense fallback={<p>...loading</p>}>
        {/* <LessonSkeleton /> */}
        <LessonsPage />
      </Suspense>
    ),
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
