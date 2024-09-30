import LessonHeader from '@/components/features/lessons/LessonHeader'
import AllLessons from '@/components/features/lessons/all-lessons/AllLessons.component'
import Repertoire from '@/components/features/repertoire/Repertoire.component'
import { Outlet, type RouteObject } from 'react-router-dom'
import NoStudents from '@/components/features/lessons/NoStudents.component'
import { ScrollArea } from '@/components/ui/scroll-area'
import LessonsPage from '@/pages/Lessons.page'
import LessonNav from '@/components/features/lessons/LessonNav.component'
import MusicTools from '@/components/features/lessons/toolbox/Toolbox.component'
import useIsOnline from '@/hooks/useIsOnline'
import { cn } from '@/lib/utils'
import useHasBanner from '@/hooks/useHasBanner'

const LessonsWrapper = () => {
  const hasBanner = useHasBanner()
  return (
    <div className='pt-[80px] md:pt-[88px]'>
      <LessonHeader />
      <ScrollArea
        className={cn(
          hasBanner
            ? 'mt-[32px] md:h-[calc(100vh-120px)]'
            : 'md:h-[calc(100vh-88px)]',
        )}
      >
        <Outlet />
      </ScrollArea>
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
