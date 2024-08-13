import type { LessonHolder, TTodoItem } from '@/types/types'
import { Badge } from '@/components/ui/badge'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useLessonPointer } from '@/services/context/LessonPointerContext'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import OpenTodoDropdown from './OpenTodoDropdown.component'
import { useCompleteTodo } from './useCompleteTodo'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import CompletedTodoDropdown from './CompletedTodoDropdown.component'

interface TodoItemProps {
  todo: TTodoItem
  type: 'open' | 'completed'
  grid: string
}

function TodoItem({ todo, type, grid }: TodoItemProps) {
  const { userLocale } = useUserLocale()
  const navigate = useNavigate()
  const { lessonHolders } = useLessonPointer()
  const { completeTodo } = useCompleteTodo()
  const today = new Date()
  const isOverdue = todo.due && todo.due < today
  let currentHolder: LessonHolder | undefined

  if (todo.studentId)
    currentHolder = lessonHolders.find(
      (holder) => holder.type === 's' && holder.holder.id === todo.studentId,
    )
  if (todo.groupId)
    currentHolder = lessonHolders.find(
      (holder) => holder.type === 'g' && holder.holder.id === todo.groupId,
    )

  let currentHolderName = ''
  if (currentHolder?.type === 's')
    currentHolderName = `${currentHolder.holder.firstName} ${currentHolder.holder.lastName}`

  if (currentHolder?.type === 'g') currentHolderName = currentHolder.holder.name
  function navigateToHolder() {
    if (!currentHolder) return
    const holderId = `${currentHolder.type}-${currentHolder.holder.id}`
    navigate(`/lessons/${holderId}`)
  }

  return (
    <li
      className={cn(
        grid,
        'bg-background50 mb-2 mt-5 flex flex-wrap gap-2 justify-between rounded-sm shadow-sm border-background200 border',
        'sm:mt-0 sm:grid ',
      )}
    >
      <div className='flex basis-full gap-2 items-center'>
        {type === 'open' && (
          <Checkbox
            onClick={() => completeTodo(todo.id)}
            className='size-[12px] rounded-[3px]'
          />
        )}
        {type === 'completed' && <Check className='size-3 text-primary' />}
        <span className='text-sm basis-full'>{todo.text}</span>
      </div>
      <span>
        {currentHolderName ? (
          <Badge onClick={navigateToHolder} className='cursor-pointer w-fit'>
            {currentHolderName}
          </Badge>
        ) : null}
      </span>
      <span className={cn('text-sm', isOverdue && 'text-warning')}>
        {todo.due
          ? todo.due.toLocaleDateString(userLocale, {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          : null}
      </span>

      <div className='flex justify-self-end'>
        {type === 'open' && <OpenTodoDropdown id={todo.id} />}
        {type === 'completed' && <CompletedTodoDropdown id={todo.id} />}
      </div>
    </li>
  )
}

export default TodoItem
