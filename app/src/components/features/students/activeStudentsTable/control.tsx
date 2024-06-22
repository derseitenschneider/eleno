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
import { ActiveStudentsActionDropdown } from "./actionDropdown"
import ExportStudentList from "../ExportStudentList.component"

type StudentsControlProps = {
  isFetching: boolean
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  selected: RowSelectionState
}
export default function StudentsControl({
  globalFilter,
  setGlobalFilter,
  isFetching,
  selected,
}: StudentsControlProps) {
  const queryClient = useQueryClient()
  const students = queryClient.getQueryData(["students"]) as Array<Student>
  const activeStudents = students.filter((student) => !student.archive)

  const [modalOpen, setModalOpen] = useState<"EXPORT" | "NEW" | undefined>()

  const hasActiveStudents = activeStudents.length > 0
  const isDisabledControls = activeStudents.length === 0 || isFetching

  return (
    <div className='flex items-end gap-4 mb-4'>
      <div className='mr-auto items-baseline flex gap-4'>
        <ActiveStudentsActionDropdown selected={selected} />
        {hasActiveStudents && (
          <p className='text-sm'>
            Aktive Schüler:innen: <span>{activeStudents.length}</span>
          </p>
        )}
      </div>
      <Button
        size='sm'
        variant='outline'
        onClick={() => setModalOpen("EXPORT")}
        disabled={isDisabledControls}
      >
        <File className='h-4 w-4 text-primary mr-1' />
        Exportieren
      </Button>
      <SearchBar
        searchInput={globalFilter}
        setSearchInput={(input) => setGlobalFilter(input)}
        disabled={isDisabledControls}
      />
      <Button
        disabled={isFetching}
        size='sm'
        onClick={() => setModalOpen("NEW")}
      >
        <Plus className='size-4 mr-1' />
        <span className='text-white'>Neu</span>
      </Button>
      <Dialog
        open={modalOpen === "EXPORT"}
        onOpenChange={() => setModalOpen(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schülerliste exportieren</DialogTitle>
            <ExportStudentList students={activeStudents} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
