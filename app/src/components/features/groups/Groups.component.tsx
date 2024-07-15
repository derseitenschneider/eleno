import useGroupsQuery from './groupsQuery'
import GroupsControl from './groupsTable/control'
import GroupsTable from './groupsTable/table'

export default function Groups() {
  const { data: groups, isPending, isError, isFetching } = useGroupsQuery()
  if (!groups) return null
  return (
    <div>
      <GroupsTable
        groups={groups}
        isPending={isPending}
        isError={isError}
        isFetching={isFetching}
      />
    </div>
  )
}
