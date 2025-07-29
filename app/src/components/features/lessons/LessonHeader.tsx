import { NavLink } from 'react-router-dom'

import HolderDropdownLesson from '@/components/features/lessons/StudentDropdownLesson.component'
import { User, Users } from 'lucide-react'
import useCurrentHolder from './useCurrentHolder'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import useHasBanner from '@/hooks/useHasBanner'
import { RepertoireNavButton } from '../repertoire/RepertoireNavButton.component'

function LessonHeader() {
  const { currentLessonHolder } = useCurrentHolder()
  const hasBanner = useHasBanner()

  if (!currentLessonHolder) return null
  const { holder, type } = currentLessonHolder

  return (
    <header
      className={cn(
        !hasBanner ? 'mt-0' : 'mt-[49px] sm:mt-[32px]',
        'lg:pr-4 sm:h-[88px] sm:pl-6 sm:py-4 z-10 bg-background100 px-5 py-4 right-0 left-0 md:left-[50px] border-b border-hairline',
      )}
    >
      <div className='flex items-end justify-between'>
        <div className='w-full'>
          <div className='flex items-center sm:mb-1 '>
            <NavLink
              to={`/lessons/${type === 's' ? `s-${holder.id}` : `g-${holder.id}`
                }`}
              className='flex items-baseline hover:no-underline'
            >
              <div className='mr-[4px] h-4 translate-y-[1px] text-primary'>
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
          <div className='flex items-center gap-1 text-sm'>
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
                    <Users className='mr-1 size-3' />
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
        <div className='flex gap-4'>
          <RepertoireNavButton />
        </div>
      </div>
    </header>
  )
}

export default LessonHeader
