import { useStudents } from "@/services/context/StudentContext"
import {
  CheckSquare2,
  Download,
  File,
  FileDown,
  MoreVertical,
  Pencil,
} from "lucide-react"
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

import { useParams, useSearchParams } from "react-router-dom"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../ui/sheet"
import AddTodo from "../todos/AddTodo.component"
import ExportLessons from "./ExportLessons.component"

type Modals = "EDIT" | "TODO" | "EXPORT" | null

export default function StudentDropdownLesson() {
  const { studentId } = useParams()
  const [openModal, setOpenModal] = useState<Modals>(null)
  const [searchParams, setSearchParams] = useSearchParams({})

  const closeModal = () => setOpenModal(null)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='text-primary h-4'>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className='flex items-center gap-2'
            onClick={() => {
              setOpenModal("EDIT")
            }}
          >
            <Pencil className='text-primary h-4 w-4' />
            <span>Schüler:in bearbeiten</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='flex items-center gap-2'
            onClick={() => {
              setOpenModal("TODO")
            }}
          >
            <CheckSquare2 className='text-primary h-4 w-4' />
            <span>Todo erfassen</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='flex items-center gap-2'
            onClick={() => setOpenModal("EXPORT")}
          >
            <FileDown className='text-primary h-4 w-4' />
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
            studentId={Number(studentId)}
          />
        </SheetContent>
      </Sheet>

      <Dialog open={openModal === "TODO"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Todo erstellen</DialogTitle>
          </DialogHeader>
          <AddTodo studentId={Number(studentId)} onCloseModal={closeModal} />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === "EXPORT"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
          </DialogHeader>
          <ExportLessons studentId={Number(studentId)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
