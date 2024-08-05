import type { LessonHolder, TTodoItem } from '@/types/types'
import { Badge } from '@/components/ui/badge'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useLessonPointer } from '@/services/context/LessonPointerContext'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import OpenTodoDropdown from './OpenTodoDropdown.component'

interface TodoItemProps {
  todo: TTodoItem
  type: 'open' | 'completed'
  grid: string
}

function TodoItem({ todo, type, grid }: TodoItemProps) {
  const { userLocale } = useUserLocale()
  const { lessonHolders } = useLessonPointer()
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

  return (
    <li
      className={cn(
        grid,
        'bg-background50 mb-2 shadow-sm border-background200 border',
      )}
    >
      <div className='flex'>
        {type === 'open' && <Checkbox className='size-[12px] rounded-[3px]' />}
      </div>
      <span className='text-sm'>{todo.text}</span>
      <span>
        {currentHolderName ? (
          <Badge className='w-fit'>{currentHolderName}</Badge>
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
        {type === 'open' && <OpenTodoDropdown />}
      </div>
    </li>
  )
}

export default TodoItem
