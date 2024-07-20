import { Button } from '@/components/ui/button'
import SearchBar from '@/components/ui/SearchBar.component'
import type { Group, Student } from '@/types/types'
import { File, Plus } from 'lucide-react'
import type { RowSelectionState, Table } from '@tanstack/react-table'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { InactiveStudentsActionDropdown } from './actionDropdown'
import ExportStudentList from '../../ExportStudentList.component'
import CreateStudents from '../../CreateStudents.component'

type StudentsControlProps = {
  isFetching: boolean
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  selected: RowSelectionState
  setSelected: React.Dispatch<React.SetStateAction<RowSelectionState>>
}
export default function InactiveStudentsControl({
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
    <div className='flex items-end gap-4 mb-4'>
      <div className='mr-auto items-baseline flex gap-4'>
        <InactiveStudentsActionDropdown
          setSelected={setSelected}
          selected={selected}
        />
        <div className='flex items-center gap-2'>
          {inactiveStudents && inactiveStudents?.length > 0 && (
            <p className='text-sm'>
              Archivierte Schüler:innen: <span>{inactiveStudents.length}</span>
            </p>
          )}
          {inactiveGroups && inactiveGroups?.length > 0 && (
            <>
              <span>|</span>
              <p className='text-sm'>
                Archivierte Gruppen: <span>{inactiveGroups.length}</span>
              </p>
            </>
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
