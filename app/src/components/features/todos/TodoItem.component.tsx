import type { LessonHolder, TTodoItem } from '@/types/types'
import { Badge } from '@/components/ui/badge'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import OpenTodoDropdown from './OpenTodoDropdown.component'
import { useCompleteTodo } from './useCompleteTodo'
import { Check, ChevronRight } from 'lucide-react'
import CompletedTodoDropdown from './CompletedTodoDropdown.component'
import useNavigateToHolder from '@/hooks/useNavigateToHolder'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'

export interface TodoItemProps {
  todo: TTodoItem
  type: 'open' | 'completed'
}

function TodoItem({ todo, type }: TodoItemProps) {
  const isMobile = useIsMobileDevice()
  const { userLocale } = useUserLocale()
  const { navigateToHolder } = useNavigateToHolder()
  const { activeSortedHolders, inactiveLessonHolders } = useLessonHolders()
  const { completeTodo } = useCompleteTodo()
  const today = new Date()
  const isOverdue = todo.due && todo.due < today

  const combinedHolders = []
  if (activeSortedHolders) combinedHolders.push(...activeSortedHolders)
  if (inactiveLessonHolders) combinedHolders.push(...inactiveLessonHolders)

  let currentHolder: LessonHolder | undefined
  if (todo.studentId) {
    currentHolder = combinedHolders.find(
      (holder) => holder.holder.id === todo.studentId,
    )
  } else {
    currentHolder = combinedHolders.find(
      (holder) => holder.holder.id === todo.groupId,
    )
  }

  let currentHolderName = ''
  if (currentHolder?.type === 's')
    currentHolderName = `${currentHolder.holder.firstName} ${currentHolder.holder.lastName}`

  if (currentHolder?.type === 'g') currentHolderName = currentHolder.holder.name

  function handleBadgeClick() {
    if (!currentHolder || currentHolder.holder.archive) return
    navigateToHolder(`${currentHolder.type}-${currentHolder.holder.id}`)
  }

  return (
    <li
      className={cn(
        'grid-cols-[30px_1fr_30px] items-center',
        'bg-background50/30 mb-2 mt-5 p-2 justify-between rounded-sm shadow-sm border-hairline border',
        'md:mt-0 grid',
        isOverdue && 'border-warning/20 bg-warning/5',
      )}
    >
      <div className='flex'>
        {type === 'open' && (
          <Checkbox
            onClick={() => completeTodo(todo.id)}
            className='rounded-[3px] sm:size-[12px]'
          />
        )}
        {type === 'completed' && <Check className='size-3 text-primary' />}
      </div>
      <div className='flex w-full flex-wrap items-start justify-between gap-x-2 gap-y-2 md:grid md:grid-cols-[1fr_250px_100px]'>
        <span
          className={cn(
            'text-sm md:basis-auto w-full mr-auto',
            currentHolderName && todo.due && 'basis-full',
          )}
        >
          {todo.text}
        </span>
        <span className={cn(!todo.due && '', 'md:ml-0')}>
          {currentHolder ? (
            <Badge
              onClick={handleBadgeClick}
              className={cn(
                'cursor-pointer w-fit',
                currentHolder.holder.archive &&
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
                year: '2-digit',
              })
            : null}
        </span>
      </div>
      <div className='flex justify-self-end'>
        {isMobile ? (
          <ChevronRight className='size-5' />
        ) : (
          <>
            {type === 'open' && <OpenTodoDropdown id={todo.id} />}
            {type === 'completed' && <CompletedTodoDropdown id={todo.id} />}
          </>
        )}
      </div>
    </li>
  )
}

export default TodoItem
