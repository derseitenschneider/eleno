import LessonHeader from '@/components/features/lessons/LessonHeader'
import AllLessons from '@/components/features/lessons/all-lessons/AllLessons.component'
import Repertoire from '@/components/features/repertoire/Repertoire.component'
import { Outlet, type RouteObject } from 'react-router-dom'
import NoStudents from '@/components/features/lessons/NoStudents.component'
import LessonsPage from '@/pages/Lessons.page'
import LessonNav from '@/components/features/lessons/LessonNav.component'
import MusicTools from '@/components/features/lessons/toolbox/Toolbox.component'

const LessonsWrapper = () => {
  return (
    <div className='grid max-h-dvh grid-rows-[auto_1fr] overflow-hidden lg:max-h-[unset] lg:min-h-dvh'>
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
        element: <AllLessons />,
      },
      {
        path: 'repertoire',
        element: <Repertoire />,
      },
    ],
  },
  {
    path: '/lessons/no-students',
    element: <NoStudents />,
  },
]
export default lessonsRoutes
