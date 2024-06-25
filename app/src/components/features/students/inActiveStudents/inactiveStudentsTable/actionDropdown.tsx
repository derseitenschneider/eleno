import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Student } from "@/types/types"
import { useQueryClient } from "@tanstack/react-query"
import type { RowSelectionState, Table } from "@tanstack/react-table"
import {
  Archive,
  ChevronsUpDown,
  FileDown,
  History,
  Pencil,
  Trash2,
  Undo2,
} from "lucide-react"
import { useState } from "react"
import BulkExportLessons from "../../../lessons/bulkExportLessons/BulkExportLessons.component"
import BulkEditStudents from "../../BulkEditStudents.component"
import DeleteStudents from "../../deleteStudents/DeleteStudents.component"
import ResetStudents from "../../ResetStudents.component"
import { useDeactivateStudents } from "../../useDeactivateStudents"
import { useReactivateStudents } from "../../useReactivateStudents"

type ActiveStudentsActionDropdownProps = {
  selected: RowSelectionState
}

export function InactiveStudentsActionDropdown({
  selected,
}: ActiveStudentsActionDropdownProps) {
  const queryClient = useQueryClient()
  const { reactivateStudents } = useReactivateStudents()
  const [openModal, setOpenModal] = useState<"DELETE" | null>(null)
  const students = queryClient.getQueryData(["students"]) as Array<Student>

  const isDisabledAction = Object.entries(selected).length === 0
  const selectedStudentIds = Object.keys(selected).map((id) => Number(id))

  function closeModal() {
    setOpenModal(null)
  }
  if (!students) return null
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='sm' variant='outline' disabled={isDisabledAction}>
            <span className='text-inherit mr-1'>Aktion</span>
            <ChevronsUpDown className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => reactivateStudents(selectedStudentIds)}
            className='flex items-center gap-2'
          >
            <Undo2 className='h-4 w-4 text-primary' />
            <span>Wiederherstellen</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenModal("DELETE")}
            className='flex items-center gap-2'
          >
            <Trash2 className='h-4 w-4 text-warning' />
            <span>Löschen</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === "DELETE"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogTitle>Schüler:innen löschen</DialogTitle>
          <DeleteStudents
            studentIds={selectedStudentIds}
            onSuccess={closeModal}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
