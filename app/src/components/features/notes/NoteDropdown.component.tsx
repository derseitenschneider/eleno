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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Layers2, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

type NoteDropdownProps = {
  id: number
}

export default function NoteDropdown({ id }: NoteDropdownProps) {
  const [openModal, setOpenModal] = useState<
    "EDIT" | "DUPLICATE" | "DELETE" | undefined
  >()

  function closeModal() {
    setOpenModal(undefined)
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className='h-4 w-4 text-primary' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setOpenModal("EDIT")}
            className='flex items-center gap-2'
          >
            <Pencil className='h-4 w-4 text-primary' />
            <span>Notiz bearbeiten</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenModal("DUPLICATE")}
            className='flex items-center gap-2'
          >
            <Layers2 className='h-4 w-4 text-primary' />
            <span>Notiz duplizieren</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setOpenModal("DELETE")}
            className='flex items-center gap-2'
          >
            <Trash2 className='h-4 w-4 text-warning' />
            <span>Notiz löschen</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === "EDIT"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notiz bearbeiten</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === "DUPLICATE"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notiz duplizieren</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === "DELETE"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notiz löschen</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
