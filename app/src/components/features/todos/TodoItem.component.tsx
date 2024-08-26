import type { LessonHolder, TTodoItem } from '@/types/types'
import { Badge } from '@/components/ui/badge'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import OpenTodoDropdown from './OpenTodoDropdown.component'
import { useCompleteTodo } from './useCompleteTodo'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import CompletedTodoDropdown from './CompletedTodoDropdown.component'
import { useState } from 'react'

interface TodoItemProps {
  todo: TTodoItem
  type: 'open' | 'completed'
}

function TodoItem({ todo, type }: TodoItemProps) {
  const { userLocale } = useUserLocale()
  const [isHolderActive, setIsHolderActive] = useState(true)
  const navigate = useNavigate()
  const { activeSortedHolders: lessonHolders, inactiveLessonHolders } =
    useLessonHolders()
  const { completeTodo } = useCompleteTodo()
  const today = new Date()
  const isOverdue = todo.due && todo.due < today
  let currentHolder: LessonHolder | undefined

  if (todo.studentId) {
    currentHolder = lessonHolders.find(
      (holder) => holder.type === 's' && holder.holder.id === todo.studentId,
    )
    if (!currentHolder) {
      if (isHolderActive) setIsHolderActive(false)
      currentHolder = inactiveLessonHolders.find(
        (holder) => holder.type === 's' && holder.holder.id === todo.studentId,
      )
    }
  }

  if (todo.groupId) {
    currentHolder = lessonHolders.find(
      (holder) => holder.type === 'g' && holder.holder.id === todo.groupId,
    )
    if (!currentHolder) {
      if (isHolderActive) setIsHolderActive(false)
      currentHolder = inactiveLessonHolders.find(
        (holder) => holder.type === 'g' && holder.holder.id === todo.groupId,
      )
    }
  }

  let currentHolderName = ''
  if (currentHolder?.type === 's')
    currentHolderName = `${currentHolder.holder.firstName} ${currentHolder.holder.lastName}`

  if (currentHolder?.type === 'g') currentHolderName = currentHolder.holder.name

  function navigateToHolder() {
    if (!currentHolder || !isHolderActive) return
    const holderId = `${currentHolder.type}-${currentHolder.holder.id}`
    navigate(`/lessons/${holderId}`)
  }

  return (
    <li
      className={cn(
        'grid-cols-[30px_1fr_30px] items-center',
        'bg-background50 mb-2 mt-5 p-2 justify-between rounded-sm shadow-sm border-background200 border',
        'md:mt-0 grid',
        isOverdue && 'border-warning/20 bg-warning/5',
      )}
    >
      <div>
        {type === 'open' && (
          <Checkbox
            onClick={() => completeTodo(todo.id)}
            className='sm:size-[12px] rounded-[3px]'
          />
        )}
        {type === 'completed' && <Check className='size-3 text-primary' />}
      </div>
      <div className='flex flex-wrap justify-between items-center gap-y-2 md:grid md:grid-cols-[1fr_250px_100px]'>
        <span
          className={cn(
            'text-sm md:basis-auto',
            currentHolderName && todo.due && 'basis-full',
          )}
        >
          {todo.text}
        </span>
        <span className={cn(!todo.due && 'ml-auto', 'md:ml-0')}>
          {currentHolderName ? (
            <Badge
              onClick={navigateToHolder}
              className={cn(
                'cursor-pointer w-fit',
                !isHolderActive &&
                  'bg-foreground/30 hover:bg-foreground/30 cursor-auto text-white/70 line-through',
              )}
            >
              {currentHolderName}
            </Badge>
          ) : null}
        </span>
        <span
          className={cn(
            'text-sm md:ml-0',
            isOverdue && 'text-warning',
            todo.due && 'ml-auto',
          )}
        >
          {todo.due
            ? todo.due.toLocaleDateString(userLocale, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : null}
        </span>
      </div>
      <div className='flex justify-self-end'>
        {type === 'open' && <OpenTodoDropdown id={todo.id} />}
        {type === 'completed' && <CompletedTodoDropdown id={todo.id} />}
      </div>
    </li>
  )
}

export default TodoItem
