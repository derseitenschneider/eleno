import LessonHeader from "@/components/features/lessons/LessonHeader"
import AllLessons from "@/components/features/lessons/all-lessons/allLessonsTable"
import Repertoire from "@/components/features/repertoire/Repertoire.component"
import { motion } from "framer-motion"
import { Suspense, lazy } from "react"
import { Outlet } from "react-router-dom"
import NoStudents from "@/components/features/lessons/NoStudents.component"
import LessonFooter from "@/components/features/lessons/LessonFooter.component"
import StudentsSkeleton from "@/components/ui/skeletons/StudentsSkeleton.component"
import Students from "@/pages/students/Students"
import ActiveStudents from "@/components/features/students/activeStudents/ActiveStudents.component"
import InactiveStudents from "@/components/features/students/inActiveStudents/InactiveStudents.component"
import Groups from "@/components/features/groups/Groups.component"

const LessonsPage = lazy(() => import("../pages/Lessons.page"))

const studentsRoutes = [
  {
    path: "students",
    element: (
      <Suspense fallback={<StudentsSkeleton />}>
        <Students />
      </Suspense>
    ),
    children: [
      {
        index: true,
        path: "",
        element: <ActiveStudents />,
      },
      {
        path: "archive",
        element: <InactiveStudents />,
      },
      // {
      //   path: "groups",
      //   element: <Groups />,
      // },
    ],
  },
]
export default studentsRoutes
