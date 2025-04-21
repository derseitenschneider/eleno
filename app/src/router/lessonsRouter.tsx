import LessonHeader from '@/components/features/lessons/LessonHeader'
import AllLessons from '@/components/features/lessons/all-lessons/AllLessons.component'
import Repertoire from '@/components/features/repertoire/Repertoire.component'
import { Outlet, type RouteObject } from 'react-router-dom'
import NoStudents from '@/components/features/lessons/NoStudents.component'
import { ScrollArea } from '@/components/ui/scroll-area'
import LessonsPage from '@/pages/Lessons.page'
import LessonNav from '@/components/features/lessons/LessonNav.component'
import MusicTools from '@/components/features/lessons/toolbox/Toolbox.component'
import { cn } from '@/lib/utils'
import useHasBanner from '@/hooks/useHasBanner'

const LessonsWrapper = () => {
  const hasBanner = useHasBanner()
  return (
    <div className='min-[1180px]:max-h-screen grid grid-rows-[auto_1fr] overflow-hidden'>
      <LessonHeader />
      <Outlet />
      <MusicTools />
      <LessonNav />
    </div>
  )
}

const lessonsRoutes: Array<RouteObject> = [
  {
    path: '/lessons/:holderId',
    element: <LessonsWrapper />,
    children: [
      {
        index: true,
        element: <LessonsPage />,
      },
      {
        path: 'all',
        element: (
          <div className='container-page'>
            <AllLessons />
          </div>
        ),
      },
      {
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
