import useStudentsQuery from '../studentsQueries'
import ActiveStudentsTable from './activeStudentsTable/table'
import { compareLastName } from '@/utils/sortLessonHolders'

export default function ActiveStudents() {
  const { data: students, isPending, isError, isFetching } = useStudentsQuery()
  if (!students) return null
  const activeSortedStudents = students
    ?.filter((student) => !student.archive)
    .sort(compareLastName)
  return (
    <>
      <ActiveStudentsTable
        students={activeSortedStudents}
        isPending={isPending}
        isError={isError}
        isFetching={isFetching}
      />
    </>
  )
}
