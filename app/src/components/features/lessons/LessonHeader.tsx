import { NavLink } from 'react-router-dom'

import HolderDropdownLesson from '@/components/features/lessons/StudentDropdownLesson.component'
import { Group, TableProperties, User, Users } from 'lucide-react'
import useCurrentHolder from './useCurrentHolder'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

function LessonHeader() {
  const { currentLessonHolder } = useCurrentHolder()
  if (!currentLessonHolder) return null

  return (
    <header className='sm:pr-4 sm:h-[88px] sm:pl-8 sm:py-4 z-10 bg-background100 p-4 right-0 fixed left-0 md:left-[50px] top-0 border-b border-hairline'>
      <div className='flex items-end justify-between'>
        <div className='flex w-full md:block items-baseline justify-between'>
          <NavLink
            to={`/lessons/${currentLessonHolder.type === 's'
                ? `s-${currentLessonHolder.holder.id}`
                : `g-${currentLessonHolder.holder.id}`
              }`}
            className='flex mb-1 items-center hover:no-underline'
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
            {currentLessonHolder.holder.dayOfLesson ||
              currentLessonHolder.holder.startOfLesson ||
              currentLessonHolder.holder.endOfLesson ? (
              <span>
                {currentLessonHolder.holder.dayOfLesson &&
                  `${currentLessonHolder.holder.dayOfLesson}`}
                {currentLessonHolder.holder.startOfLesson
                  ? `, ${currentLessonHolder.holder.startOfLesson.slice(0, 5)}`
                  : null}
                {currentLessonHolder.holder.endOfLesson &&
                  ` - ${currentLessonHolder.holder.endOfLesson.slice(0, 5)}`}
              </span>
            ) : null}
            {currentLessonHolder.holder.dayOfLesson ||
              currentLessonHolder.holder.durationMinutes ? (
              <span className='hidden md:inline'>
                {currentLessonHolder.holder.dayOfLesson &&
                  currentLessonHolder.holder.durationMinutes &&
                  ' | '}
              </span>
            ) : null}
            {currentLessonHolder.holder.durationMinutes && (
              <span className='mr-2 hidden md:inline'>
                {currentLessonHolder.holder.durationMinutes} Minuten
              </span>
            )}
            {currentLessonHolder.type === 'g' &&
              currentLessonHolder.holder.students?.length !== 0 && (
                <Popover>
                  <PopoverTrigger>
                    <Badge className='hidden sm:flex'>
                      <Users className='size-3 mr-1' />
                      Gruppe
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent>
                    <h4>
                      {currentLessonHolder.holder.students.length} Schüler:innen
                    </h4>
                    <ul>
                      {currentLessonHolder.holder.students?.map((student) => (
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
          className='hidden md:flex gap-1 text-sm p-2 bg-background50 items-center'
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
