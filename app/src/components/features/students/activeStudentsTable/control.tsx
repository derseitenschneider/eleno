import { Button } from "@/components/ui/button"
import SearchBar from "@/components/ui/SearchBar.component"
import type { Lesson, RepertoireItem, Student } from "@/types/types"
import {
  Archive,
  ChevronsUpDown,
  File,
  FileDown,
  History,
  Pencil,
} from "lucide-react"
import type { Table } from "@tanstack/react-table"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type StudentsControlProps = {
  table: Table<Student>
  isFetching: boolean
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
}
export default function StudentsControl({
  globalFilter,
  setGlobalFilter,
}: StudentsControlProps) {
  const queryClient = useQueryClient()
  const students = queryClient.getQueryData(["students"]) as Array<Student>

  const [modalOpen, setModalOpen] = useState<"EXPORT" | undefined>()

  const hasStudents = students.length > 0

  return (
    <div className='flex items-end gap-4 mb-4'>
      <div className='mr-auto'>
        {hasStudents && (
          <p className='text-sm mb-3'>
            Aktive Schüler:innen: <span>{students.length}</span>
          </p>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='sm' variant='outline'>
              <span className='text-inherit mr-1'>Aktion</span>
              <ChevronsUpDown className='size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              // onClick={() => setOpenModal("EDIT")}
              className='flex items-center gap-2'
            >
              <Pencil className='h-4 w-4 text-primary' />
              <span>Bearbeiten</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              // onClick={() => setOpenModal("EDIT")}
              className='flex items-center gap-2'
            >
              <FileDown className='h-4 w-4 text-primary' />
              <span>Lektionslisten exportieren</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              // onClick={() => setOpenModal("EDIT")}
              className='flex items-center gap-2'
            >
              <History className='h-4 w-4 text-primary' />
              <span>Zurücksetzten</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              // onClick={() => setOpenModal("EDIT")}
              className='flex items-center gap-2'
            >
              <Archive className='h-4 w-4 text-primary' />
              <span>Archivieren</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        size='sm'
        variant='outline'
        onClick={() => setModalOpen("EXPORT")}
        disabled={!hasStudents}
      >
        <File className='h-4 w-4 text-primary mr-2' />
        Exportieren
      </Button>
      <SearchBar
        searchInput={globalFilter || ""}
        setSearchInput={(value) => setGlobalFilter(value)}
        disabled={!hasStudents}
      />
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
