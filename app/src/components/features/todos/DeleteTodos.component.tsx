import { Button } from '@/components/ui/button'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import MiniLoader from '@/components/ui/MiniLoader.component'
import type { TTodoItem } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
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
      <DialogHeader>
        <DialogTitle>Todo{todoIds.length > 1 && 's'} löschen</DialogTitle>
      </DialogHeader>
      <div>
        {todoIds.length === 1 ? (
          <p>
            Möchtest du die Todo{' '}
            <span className='font-bold text-primary hyphens-auto'>{text}</span>{' '}
            unwiederruflich löschen?
          </p>
        ) : (
          <p>Möchtest du alle erledigten Todos unwiederruflich löschen?</p>
        )}
        <div className='flex justify-end gap-4 mt-4'>
          <Button
            disabled={isDeleting}
            size='sm'
            variant='outline'
            onClick={onCloseModal}
          >
            Abbrechen
          </Button>
          <div className='flex items-center gap-2'>
            <Button
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
