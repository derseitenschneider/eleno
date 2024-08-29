import LessonHeader from '@/components/features/lessons/LessonHeader'
import AllLessons from '@/components/features/lessons/all-lessons/AllLessons.component'
import Repertoire from '@/components/features/repertoire/Repertoire.component'
import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'
import NoStudents from '@/components/features/lessons/NoStudents.component'
import LessonFooter from '@/components/features/lessons/LessonFooter.component'
import { ScrollArea } from '@/components/ui/scroll-area'

const LessonsPage = lazy(() => import('../pages/Lessons.page'))

const lessonsRoutes = [
  {
    path: '/lessons/:holderId',
    element: (
      <Suspense fallback={<p>...loading</p>}>
        <motion.div
          className='pt-[80px] md:pt-[88px]'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LessonHeader />
          <ScrollArea className='md:h-[calc(100vh-88px)] max-w-full'>
            <Outlet />
          </ScrollArea>
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
        // end: true,
        path: 'all',
        element: (
          <div className='container-page'>
            <AllLessons />
          </div>
        ),
      },
      {
        end: true,
        path: 'repertoire',
        element: (
          <div className='container-page'>
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
