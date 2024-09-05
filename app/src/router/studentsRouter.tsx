import { Suspense, lazy } from 'react'
import StudentsSkeleton from '@/components/ui/skeletons/StudentsSkeleton.component'
import ActiveStudents from '@/components/features/students/activeStudents/ActiveStudents.component'
import InactiveLessonHolders from '@/components/features/students/InactiveLessonHolders.component'
import Groups from '@/components/features/groups/Groups.component'
import Students from '@/pages/Students'

// const Students = lazy(() => import('@/pages/Students'))

const studentsRoutes = [
  {
    path: 'students',
    // element: (
    //   <Suspense fallback={<StudentsSkeleton />}>
    //     <Students />
    //   </Suspense>
    // ),
    element: <Students />,
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
