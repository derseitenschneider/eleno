import { Button } from "@/components/ui/button"
import SearchBar from "@/components/ui/SearchBar.component"
import type { Student } from "@/types/types"
import { File, Plus } from "lucide-react"
import type { Table } from "@tanstack/react-table"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ActiveStudentsActionDropdown } from "./actionDropdown"

type StudentsControlProps = {
  table: Table<Student>
  isFetching: boolean
  // globalFilter: string
  // setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
}
export default function StudentsControl() {
  const queryClient = useQueryClient()
  const students = queryClient.getQueryData(["students"]) as Array<Student>
  const activeStudents = students.filter((student) => !student.archive)

  const [modalOpen, setModalOpen] = useState<"EXPORT" | "NEW" | undefined>()

  const hasActiveStudents = activeStudents.length > 0

  return (
    <div className='flex items-end gap-4 mb-4'>
      <div className='mr-auto'>
        {hasActiveStudents && (
          <p className='text-sm mb-3'>
            Aktive Schüler:innen: <span>{activeStudents.length}</span>
          </p>
        )}
        <ActiveStudentsActionDropdown />
      </div>
      <Button
        size='sm'
        variant='outline'
        onClick={() => setModalOpen("EXPORT")}
        disabled={!hasActiveStudents}
      >
        <File className='h-4 w-4 text-primary mr-1' />
        Exportieren
      </Button>
      <SearchBar
        searchInput={""}
        setSearchInput={() => {}}
        disabled={!hasActiveStudents}
      />
      <Button size='sm' onClick={() => setModalOpen("NEW")}>
        <Plus className='size-4 mr-1' />
        <span className='text-white'>Neu</span>
      </Button>
      <Dialog
        open={modalOpen === "EXPORT"}
        onOpenChange={() => setModalOpen(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Repertoire exportieren</DialogTitle>
            {/* <ExportRepertoire studentId={Number(studentId)} /> */}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
