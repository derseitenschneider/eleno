import { useStudents } from "@/services/context/StudentContext"
import { DialogDescription } from "@radix-ui/react-dialog"
import { useState } from "react"
import { HiDownload } from "react-icons/hi"
import { HiPencil } from "react-icons/hi2"
import { IoCheckboxOutline, IoEllipsisVertical } from "react-icons/io5"
import EditStudent from "../features/students/EditStudent.component"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./sheet"

type Modals = "EDIT" | "TODO" | "EXPORT" | null

export default function EditStudentMenu() {
  const { currentStudentId } = useStudents()
  const [openModal, setOpenModal] = useState<Modals>(null)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='text-primary h-3'>
          <IoEllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenModal("EDIT")}>
            <HiPencil className='mr-3 text-primary' />
            <span>Schüler:in bearbeiten</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenModal("TODO")}>
            <IoCheckboxOutline className='mr-3 text-primary' />
            <span>Todo erfassen</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenModal("EXPORT")}>
            <HiDownload className='mr-3 text-primary' />
            <span>Lektionsliste exportieren</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet
        open={openModal === "EDIT"}
        onOpenChange={() => setOpenModal(null)}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Schüler:in bearbeiten</SheetTitle>
          </SheetHeader>
          <EditStudent studentId={currentStudentId} />
        </SheetContent>
      </Sheet>

      <Dialog
        open={openModal === "TODO"}
        onOpenChange={() => setOpenModal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Todos</DialogTitle>
            <DialogDescription>Neue Todo erstellen</DialogDescription>
          </DialogHeader>
          <p>Ich bin ein Paragraph.</p>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openModal === "EXPORT"}
        onOpenChange={() => setOpenModal(null)}
      >
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
