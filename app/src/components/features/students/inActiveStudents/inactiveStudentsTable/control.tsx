import { Button } from "@/components/ui/button"
import SearchBar from "@/components/ui/SearchBar.component"
import type { Student } from "@/types/types"
import { File, Plus } from "lucide-react"
import type { RowSelectionState, Table } from "@tanstack/react-table"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InactiveStudentsActionDropdown } from "./actionDropdown"
import ExportStudentList from "../../ExportStudentList.component"
import CreateStudents from "../../CreateStudents.component"

type StudentsControlProps = {
  isFetching: boolean
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  selected: RowSelectionState
}
export default function InactiveStudentsControl({
  globalFilter,
  setGlobalFilter,
  isFetching,
  selected,
}: StudentsControlProps) {
  const queryClient = useQueryClient()
  const students = queryClient.getQueryData(["students"]) as Array<Student>
  const inactiveStudents = students.filter((student) => student.archive)

  const hasInactiveStudents = inactiveStudents.length > 0
  const isDisabledControls = inactiveStudents.length === 0 || isFetching

  return (
    <div className='flex items-end gap-4 mb-4'>
      <div className='mr-auto items-baseline flex gap-4'>
        <InactiveStudentsActionDropdown selected={selected} />
        {hasInactiveStudents && (
          <p className='text-sm'>
            Archivierte Schüler:innen: <span>{inactiveStudents.length}</span>
          </p>
        )}
      </div>
      <SearchBar
        searchInput={globalFilter}
        setSearchInput={(input) => setGlobalFilter(input)}
        disabled={isDisabledControls}
      />
    </div>
  )
}
