import useStudentsQuery from '../studentsQueries'
import ActiveStudentsTable from './activeStudentsTable/table'

export default function ActiveStudents() {
  const { data: students, isPending, isError, isFetching } = useStudentsQuery()
  if (!students) return null
  return (
    <>
      <ActiveStudentsTable
        students={students}
        isPending={isPending}
        isError={isError}
        isFetching={isFetching}
      />
    </>
  )
}
