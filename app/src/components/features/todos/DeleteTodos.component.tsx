import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { TTodoItem } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
import { Blocker } from '../subscription/Blocker'
import { useDeleteTodos } from './useDeleteTodos'

type DeleteTodosProps = {
  onCloseModal?: () => void
  todoIds: Array<number>
}

export default function DeleteTodos({
  todoIds,
  onCloseModal,
}: DeleteTodosProps) {
  const { deleteTodos, isDeleting } = useDeleteTodos()
  const queryClient = useQueryClient()

  let text = ''
  if (todoIds.length === 1) {
    const allTodos = queryClient.getQueryData(['todos']) as
      | Array<TTodoItem>
      | undefined
    const currentTodo = allTodos?.find((todo) => todo.id === todoIds.at(0))
    text = currentTodo?.text || ''
  }

  function handleDelete() {
    deleteTodos(todoIds, {
      onSuccess: () => {
        onCloseModal?.()
      },
    })
  }
  return (
    <>
      <div>
        <Blocker />
        <DialogDescription>
          {todoIds.length === 1
            ? 'Möchtest du die ausgewählte Todo unwiederruflich löschen?'
            : 'Möchtest du alle erledigten Todos unwiederruflich löschen?'}
        </DialogDescription>
        <div className='mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row'>
          <Button
            disabled={isDeleting}
            size='sm'
            variant='outline'
            onClick={onCloseModal}
          >
            Abbrechen
          </Button>
          <div className='flex w-full items-center gap-2 sm:w-auto'>
            <Button
              className='w-full'
              disabled={isDeleting}
              size='sm'
              variant='destructive'
              onClick={handleDelete}
            >
              Löschen
            </Button>
            {isDeleting && <MiniLoader />}
          </div>
        </div>
      </div>
    </>
  )
}
