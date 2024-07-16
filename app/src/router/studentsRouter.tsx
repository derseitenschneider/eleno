import { Suspense, lazy } from 'react'
import StudentsSkeleton from '@/components/ui/skeletons/StudentsSkeleton.component'
import Students from '@/pages/students/Students'
import ActiveStudents from '@/components/features/students/activeStudents/ActiveStudents.component'
import InactiveLessonHolders from '@/components/features/students/inActiveStudents/InactiveStudents.component'
import Groups from '@/components/features/groups/Groups.component'

const LessonsPage = lazy(() => import('../pages/Lessons.page'))

const studentsRoutes = [
  {
    path: 'students',
    element: (
      <Suspense fallback={<StudentsSkeleton />}>
        <Students />
      </Suspense>
    ),
    children: [
      {
        index: true,
        path: '',
        element: <ActiveStudents />,
      },
      {
        path: 'groups',
        element: <Groups />,
      },
      {
        path: 'archive',
        element: <InactiveLessonHolders />,
      },
    ],
  },
]
export default studentsRoutes
