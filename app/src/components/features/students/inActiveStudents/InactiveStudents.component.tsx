import type { LessonHolder } from '@/types/types'
import useGroupsQuery from '../../groups/groupsQuery'
import useStudentsQuery from '../studentsQueries'
import InactiveHoldersTable from './inactiveStudentsTable/table'

export default function InactiveLessonHolders() {
  const {
    data: students,
    isPending: isPendingStudents,
    isError: isErrorStudents,
    isFetching: isFetchingStudents,
  } = useStudentsQuery()

  const {
    data: groups,
    isPending: isPendingGroups,
    isError: isErrorGroups,
    isFetching: isFetchingGroups,
  } = useGroupsQuery()

  if (!students && !groups) return null

  const studentHolders = students?.map((student) => ({
    type: 's',
    holder: student,
  })) as Array<LessonHolder>
  const groupHolders = groups?.map((group) => ({
    type: 'g',
    holder: group,
  })) as Array<LessonHolder>

  const allHolders = [...(studentHolders || []), ...groupHolders]
  const inactiveHolders = allHolders.filter((holder) => holder.holder.archive)
  console.log(inactiveHolders)

  const isPending = isPendingStudents && isPendingGroups
  const isFetching = isFetchingStudents && isFetchingGroups
  const isError = isErrorStudents && isErrorGroups

  return (
    <>
      <InactiveHoldersTable
        inactiveHolders={inactiveHolders}
        isPending={isPending}
        isFetching={isFetching}
        isError={isError}
      />
    </>
  )
}
