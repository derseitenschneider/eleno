import { MoreVertical, Pencil } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import UpdateTodo from './UpdateTodo.component'

type OpenTodoDropdownProps = {
  id: number
}
export default function OpenTodoDropdown({ id }: OpenTodoDropdownProps) {
  const [openModal, setOpenModal] = useState<'EDIT'>()

  function closeModal() {
    setOpenModal(undefined)
  }
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className='size-4 text-primary'>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-3'>
          <DropdownMenuItem
            onClick={() => {
              setOpenModal('EDIT')
            }}
          >
            <Pencil className='mr-2 h-4 w-4 text-primary' />
            <span>Bearbeiten</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === 'EDIT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Todo bearbeiten</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Todo bearbeiten
          </DialogDescription>
          <UpdateTodo id={id} onSuccess={closeModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}
