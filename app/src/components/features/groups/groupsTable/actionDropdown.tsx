import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Group, Student } from "@/types/types"
import { useQueryClient } from "@tanstack/react-query"
import type { RowSelectionState, Table } from "@tanstack/react-table"
import {
  Archive,
  ChevronsUpDown,
  FileDown,
  History,
  Pencil,
} from "lucide-react"
import { useState } from "react"

type GroupsActionDropdownProps = {
  selected: RowSelectionState
}

export function GroupsActionDropdown({ selected }: GroupsActionDropdownProps) {
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState<
    "EDIT" | "EXPORT" | "RESET" | null
  >(null)
  const groups = queryClient.getQueryData(["groups"]) as Array<Group>

  const isDisabledAction = Object.entries(selected).length === 0
  const selectedGroupsIds = Object.keys(selected).map((id) => Number(id))
  const selectedGroups = selectedGroupsIds.map((id) =>
    groups?.find((group) => group.id === id),
  ) as Array<Group>

  function closeModal() {
    setOpenModal(null)
  }
  if (!groups) return null
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
            onClick={() => setOpenModal("EDIT")}
            className='flex items-center gap-2'
          >
            <Pencil className='h-4 w-4 text-primary' />
            <span>Bearbeiten</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenModal("EXPORT")}
            className='flex items-center gap-2'
          >
            <FileDown className='h-4 w-4 text-primary' />
            <span>Lektionslisten exportieren</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenModal("RESET")}
            className='flex items-center gap-2'
          >
            <History className='h-4 w-4 text-primary' />
            <span>Zurücksetzten</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {}}
            className='flex items-center gap-2'
          >
            <Archive className='h-4 w-4 text-primary' />
            <span>Archivieren</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === "EDIT"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogTitle>Schüler:innen bearbeiten</DialogTitle>
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === "EXPORT"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogTitle>Lektionslisten exportieren</DialogTitle>
          {/* <BulkExportLessons /> */}
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === "RESET"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogTitle>Unterrichtsdaten zurücksetzen</DialogTitle>
        </DialogContent>
      </Dialog>
    </>
  )
}
