import type { LessonHolder } from '@/types/types'
import useGroupsQuery from '../groups/groupsQuery'
import useStudentsQuery from './studentsQueries'
import InactiveHoldersTable from './inactiveHoldersTable/table'
import Empty from '@/components/ui/Empty.component'

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

  const isPending = isPendingStudents && isPendingGroups
  const isFetching = isFetchingStudents && isFetchingGroups
  const isError = isErrorStudents && isErrorGroups

  if (inactiveHolders.length === 0)
    return (
      <div className='sm:mt-20'>
        <Empty emptyMessage='Dein Archiv ist leer.' />
      </div>
    )
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
