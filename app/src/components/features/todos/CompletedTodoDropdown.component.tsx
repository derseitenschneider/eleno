import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Trash2, Undo2 } from 'lucide-react'
import { useState } from 'react'
import DeleteTodos from './DeleteTodos.component'
import { useReactivateTodo } from './useReactivateTodo'

type CompletedTodoDropdownProps = {
  id: number
}
export default function CompletedTodoDropdown({
  id,
}: CompletedTodoDropdownProps) {
  const [openModal, setOpenModal] = useState<'DELETE'>()
  const { reactivateTodo } = useReactivateTodo()

  function closeModal() {
    setOpenModal(undefined)
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='h-4 w-4 text-primary'>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              reactivateTodo(id)
            }}
          >
            <Undo2 className='size-4 text-primary mr-2' />
            <span>Wiederherstellen</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setOpenModal('DELETE')
            }}
          >
            <Trash2 className='size-4 text-warning mr-2' />
            <span>Löschen</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === 'DELETE'} onOpenChange={closeModal}>
        <DialogContent>
          <DeleteTodos todoIds={[id]} onCloseModal={closeModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}
