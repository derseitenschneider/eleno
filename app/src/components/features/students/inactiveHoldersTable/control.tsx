import SearchBar from '@/components/ui/SearchBar.component'
import type { Group, Student } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
import type { RowSelectionState } from '@tanstack/react-table'
import { InactiveStudentsActionDropdown } from './actionDropdown'

type StudentsControlProps = {
  isFetching: boolean
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  selected: RowSelectionState
  setSelected: React.Dispatch<React.SetStateAction<RowSelectionState>>
}
export default function InactiveHoldersControl({
  globalFilter,
  setGlobalFilter,
  isFetching,
  selected,
  setSelected,
}: StudentsControlProps) {
  const queryClient = useQueryClient()
  const students = queryClient.getQueryData(['students']) as
    | Array<Student>
    | undefined
  const groups = queryClient.getQueryData(['groups']) as
    | Array<Group>
    | undefined

  const inactiveStudents = students?.filter((student) => student.archive)
  const inactiveGroups = groups?.filter((group) => group.archive)

  const isDisabledControls = inactiveStudents?.length === 0 || isFetching

  return (
    <div className='mb-4 flex items-end gap-4'>
      <div className='hidden items-baseline gap-4 sm:mr-auto sm:flex'>
        <InactiveStudentsActionDropdown
          setSelected={setSelected}
          selected={selected}
        />
        <div className='hidden items-center gap-2 sm:flex'>
          {inactiveStudents && inactiveStudents?.length > 0 && (
            <p className='hidden text-sm lg:block'>
              Schüler:innen: <span>{inactiveStudents.length}</span>
            </p>
          )}
          {inactiveStudents &&
            inactiveStudents?.length > 0 &&
            inactiveGroups &&
            inactiveGroups.length > 0 && <span>|</span>}
          {inactiveGroups && inactiveGroups?.length > 0 && (
            <p className='text-sm'>
              Gruppen: <span>{inactiveGroups.length}</span>
            </p>
          )}
        </div>
      </div>
      <SearchBar
        searchInput={globalFilter}
        setSearchInput={(input) => setGlobalFilter(input)}
        disabled={isDisabledControls}
      />
    </div>
  )
}
