import { useStudents } from "@/services/context/StudentContext"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Pencil, Check, Download, Box, Square } from "lucide-react"
import { useState } from "react"
import { HiDownload } from "react-icons/hi"
import { HiPencil } from "react-icons/hi2"
import { IoCheckboxOutline, IoEllipsisVertical } from "react-icons/io5"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import StudentForm from "../students/StudentForm.component"

import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../ui/sheet"
import AddTodo from "../todos/addTodo/AddTodo.component"

type Modals = "EDIT" | "TODO" | "EXPORT" | null

export default function StudentDropdownLesson() {
  const { currentStudentId } = useStudents()
  const [openModal, setOpenModal] = useState<Modals>(null)

  const closeModal = () => setOpenModal(null)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='text-primary h-3'>
          <IoEllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenModal("EDIT")}>
            <Pencil strokeWidth={1.5} className='mr-3 text-primary h-4' />
            <span>Schüler:in bearbeiten</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenModal("TODO")}>
            <Square strokeWidth={1.5} className='mr-3 text-primary h-4' />
            <span>Todo erfassen</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenModal("EXPORT")}>
            <Download strokeWidth={1.5} className='mr-3 text-primary h-4' />
            <span>Lektionsliste exportieren</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={openModal === "EDIT"} onOpenChange={closeModal}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Schüler:in bearbeiten</SheetTitle>
          </SheetHeader>
          <StudentForm
            onSuccess={() => {
              closeModal()
            }}
            studentId={currentStudentId}
          />
        </SheetContent>
      </Sheet>

      <Dialog open={openModal === "TODO"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Todo erstellen</DialogTitle>
          </DialogHeader>
          <AddTodo studentId={currentStudentId} onCloseModal={closeModal} />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === "EXPORT"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
            <DialogDescription>Export</DialogDescription>
          </DialogHeader>
          <p>Ich bin ein Paragraph.</p>
        </DialogContent>
      </Dialog>
    </>
  )
}
