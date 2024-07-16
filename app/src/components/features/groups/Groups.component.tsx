import useGroupsQuery from './groupsQuery'
import GroupsTable from './groupsTable/table'

export default function Groups() {
  const { data: groups, isPending, isError, isFetching } = useGroupsQuery()
  if (!groups) return null
  const activeGroups = groups.filter((group) => !group.archive)

  return (
    <div>
      <GroupsTable
        groups={activeGroups}
        isPending={isPending}
        isError={isError}
        isFetching={isFetching}
      />
    </div>
  )
}
