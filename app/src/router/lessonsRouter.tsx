import LessonHeader from '@/components/features/lessons/LessonHeader'
import AllLessons from '@/components/features/lessons/all-lessons/allLessonsTable'
import Repertoire from '@/components/features/repertoire/Repertoire.component'
import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'
import NoStudents from '@/components/features/lessons/NoStudents.component'
import LessonFooter from '@/components/features/lessons/LessonFooter.component'

const LessonsPage = lazy(() => import('../pages/Lessons.page'))

const lessonsRoutes = [
  {
    path: '/lessons/:holderId',
    element: (
      <Suspense fallback={<p>...loading</p>}>
        {/* <LessonSkeleton /> */}
        <motion.div
          className='pt-16 md:pt-[88px]'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LessonHeader />
          <Outlet />
          <LessonFooter />
        </motion.div>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <LessonsPage />,
      },
      {
        end: true,
        path: 'all',
        element: (
          <div className='py-5 pl-8 pr-4'>
            <AllLessons />
          </div>
        ),
      },
      {
        end: true,
        path: 'repertoire',
        element: (
          <div className='py-5 pl-8 pr-4'>
            <Repertoire />
          </div>
        ),
      },
    ],
  },
  {
    path: '/lessons/no-students',
    element: <NoStudents />,
  },
]
export default lessonsRoutes
