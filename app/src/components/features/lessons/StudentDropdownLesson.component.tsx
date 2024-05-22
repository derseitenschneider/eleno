import { useStudents } from "@/services/context/StudentContext"
import { CheckSquare2, Download, Pencil } from "lucide-react"
import { useState } from "react"
import { IoEllipsisVertical } from "react-icons/io5"
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

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../ui/sheet"
import AddTodo from "../todos/AddTodo.component"
import ExportLessons from "./exportLessons/ExportLessons.component"

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
            <CheckSquare2 strokeWidth={1.5} className='mr-3 text-primary h-4' />
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
          <AddTodo onCloseModal={closeModal} />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === "EXPORT"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
          </DialogHeader>
          <ExportLessons />
        </DialogContent>
      </Dialog>
    </>
  )
}
