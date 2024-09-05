import LessonHeader from '@/components/features/lessons/LessonHeader'
import AllLessons from '@/components/features/lessons/all-lessons/AllLessons.component'
import Repertoire from '@/components/features/repertoire/Repertoire.component'
import { Suspense, lazy } from 'react'
import { Outlet, type RouteObject } from 'react-router-dom'
import NoStudents from '@/components/features/lessons/NoStudents.component'
import LessonFooter from '@/components/features/lessons/LessonFooter.component'
import { ScrollArea } from '@/components/ui/scroll-area'
import LessonSkeleton from '@/components/ui/skeletons/lessons/LessonSkeleton.component'
import LessonsPage from '@/pages/Lessons.page'

const lessonsRoutes: Array<RouteObject> = [
  {
    path: '/lessons/:holderId',
    // element: (
    //   <Suspense fallback={<LessonSkeleton />}>
    //     <div className='pt-[80px] md:pt-[88px]'>
    //       <LessonHeader />
    //       <ScrollArea className='md:h-[calc(100vh-88px)] max-w-full'>
    //         <Outlet />
    //       </ScrollArea>
    //       <LessonFooter />
    //     </div>
    //   </Suspense>
    // ),
    element: (
      <div className='pt-[80px] md:pt-[88px]'>
        <LessonHeader />
        <ScrollArea className='md:h-[calc(100vh-88px)] max-w-full'>
          <Outlet />
        </ScrollArea>
        <LessonFooter />
      </div>
    ),
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
