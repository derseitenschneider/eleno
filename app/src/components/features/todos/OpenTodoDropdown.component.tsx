import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Pencil } from 'lucide-react'
import { useState } from 'react'
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
      <DropdownMenu>
        <DropdownMenuTrigger className='size-4 text-primary'>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-3'>
          <DropdownMenuItem
            onClick={() => {
              setOpenModal('EDIT')
            }}
          >
            <Pencil className='h-4 w-4 text-primary mr-2' />
            <span>Bearbeiten</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === 'EDIT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Todo bearbeiten</DialogTitle>
          </DialogHeader>
          <UpdateTodo id={id} onSuccess={closeModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}
