import { NavLink } from 'react-router-dom'

import HolderDropdownLesson from '@/components/features/lessons/StudentDropdownLesson.component'
import { TableProperties, User, Users } from 'lucide-react'
import useCurrentHolder from './useCurrentHolder'
import { Badge } from '@/components/ui/badge'

function LessonHeader() {
  const { currentLessonHolder } = useCurrentHolder()
  if (!currentLessonHolder) return null

  return (
    <header className='sm:pr-4 sm:pl-8 sm:py-4 z-10 bg-background100 right-0 fixed left-[50px] top-0 border-b border-hairline'>
      <div className='flex items-end justify-between'>
        <div>
          <NavLink
            to={`/lessons/${
              currentLessonHolder.type === 's'
                ? `s-${currentLessonHolder.holder.id}`
                : `g-${currentLessonHolder.holder.id}`
            }`}
            className='flex mb-2 items-center hover:no-underline'
          >
            <div className='mr-[4px] text-foreground h-4'>
              {currentLessonHolder.type === 's' && <User strokeWidth={2} />}{' '}
              {currentLessonHolder.type === 'g' && <Users strokeWidth={2} />}
            </div>
            <span className='mr-2 text-lg'>
              {currentLessonHolder.type === 's'
                ? `${currentLessonHolder.holder.firstName} ${currentLessonHolder.holder.lastName}`
                : currentLessonHolder.holder.name}
            </span>
            <HolderDropdownLesson />
          </NavLink>
          <div className='text-sm flex items-center gap-1'>
            <span>
              {currentLessonHolder.holder.dayOfLesson &&
                `${currentLessonHolder.holder.dayOfLesson}`}
              {currentLessonHolder.holder.startOfLesson &&
                `, ${currentLessonHolder.holder.startOfLesson.slice(0, 5)}`}
              {currentLessonHolder.holder.endOfLesson &&
                ` - ${currentLessonHolder.holder.endOfLesson.slice(0, 5)}`}
            </span>
            <span>
              {currentLessonHolder.holder.dayOfLesson &&
                currentLessonHolder.holder.durationMinutes &&
                ' | '}
            </span>
            <span>
              {currentLessonHolder.holder.durationMinutes && (
                <span>
                  {currentLessonHolder.holder.durationMinutes} Minuten
                </span>
              )}
            </span>
            {currentLessonHolder.type === 'g' && <Badge>Gruppe</Badge>}
          </div>
        </div>
        <NavLink
          className='gap-1 text-sm p-2 bg-background50 flex items-center'
          to='repertoire'
        >
          <TableProperties className='size-4 text-primary' />
          <span>Repertoire</span>
        </NavLink>
      </div>
    </header>
  )
}

export default LessonHeader
