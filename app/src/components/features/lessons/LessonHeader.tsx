import { NavLink } from 'react-router-dom'

import HolderDropdownLesson from '@/components/features/lessons/StudentDropdownLesson.component'
import { TableProperties, User, Users } from 'lucide-react'
import useCurrentHolder from './useCurrentHolder'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

function LessonHeader() {
  const { currentLessonHolder } = useCurrentHolder()
  if (!currentLessonHolder) return null
  const { holder, type } = currentLessonHolder
  const isRepertoirePage = window.location.pathname.includes('repertoire')

  return (
    <header className='sm:pr-4 sm:h-[88px] sm:pl-6 sm:py-4 z-10 bg-background100 px-5 py-4 right-0 fixed left-0 md:left-[50px] top-0 border-b border-hairline'>
      <div className='flex items-end justify-between'>
        <div className='w-full'>
          <div className='flex sm:mb-1 items-center '>
            <NavLink
              to={`/lessons/${type === 's' ? `s-${holder.id}` : `g-${holder.id}`
                }`}
              className='flex items-baseline hover:no-underline'
            >
              <div className='mr-[4px] text-primary h-4 translate-y-[1px]'>
                {type === 's' && <User strokeWidth={2} />}{' '}
                {type === 'g' && <Users strokeWidth={2} />}
              </div>
              <span className='mr-2 text-lg'>
                {type === 's'
                  ? `${holder.firstName} ${holder.lastName}`
                  : holder.name}
              </span>
            </NavLink>
            <HolderDropdownLesson />
          </div>
          <div className='text-sm flex items-center gap-1'>
            {holder.dayOfLesson ||
              holder.startOfLesson ||
              holder.endOfLesson ? (
              <span className='text-foreground/80 sm:text-foreground'>
                {holder.dayOfLesson && `${holder.dayOfLesson}`}
                {holder.dayOfLesson && holder.startOfLesson && ', '}
                {holder.startOfLesson
                  ? `${holder.startOfLesson.slice(0, 5)}`
                  : null}
                {holder.endOfLesson && ` - ${holder.endOfLesson.slice(0, 5)}`}
              </span>
            ) : null}
            {holder.dayOfLesson || holder.durationMinutes ? (
              <span className='hidden md:inline'>
                {holder.dayOfLesson && holder.durationMinutes && ' | '}
              </span>
            ) : null}
            {holder.durationMinutes && (
              <span className='mr-2 hidden md:inline'>
                {holder.durationMinutes} Minuten
              </span>
            )}
            {type === 'g' && holder.students?.length !== 0 && (
              <Popover>
                <PopoverTrigger>
                  <Badge className='hidden sm:flex'>
                    <Users className='size-3 mr-1' />
                    Gruppe
                  </Badge>
                </PopoverTrigger>
                <PopoverContent>
                  <h4>{holder.students.length} Schüler:innen</h4>
                  <ul>
                    {holder.students?.map((student) => (
                      <li className='text-sm' key={student?.name}>
                        {student?.name}
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        <NavLink
          className={cn(
            'py-2 z-2 px-3 rounded-sm text-sm text-foreground relative flex items-center gap-1',
            'hover:no-underline',
            isRepertoirePage
              ? 'bg-primary/10'
              : 'bg-background50 hover:bg-background200/50',
          )}
          to='repertoire'
        >
          <TableProperties
            strokeWidth={isRepertoirePage ? 1.5 : 1}
            className={cn(
              'size-5',
              isRepertoirePage ? 'text-primary' : 'text-foreground',
            )}
          />
          <span
            className={cn(
              'translate-y-[1px] text-sm ',
              isRepertoirePage ? 'text-primary' : 'text-foreground',
            )}
          >
            Repertoire
          </span>
        </NavLink>
      </div>
    </header>
  )
}

export default LessonHeader
