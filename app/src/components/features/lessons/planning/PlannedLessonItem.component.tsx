import parse from 'html-react-parser'
import { BetweenHorizonalStart } from 'lucide-react'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useDrafts } from '@/services/context/DraftsContext'
import { usePlanLessons } from '@/services/context/LessonPlanningContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { Lesson } from '@/types/types'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import useCurrentHolder from '../useCurrentHolder'
import PlannedLessonDropdown from './PlannedLessonDropdown.component'

export type PreparedLessonItemProps = {
  currentLesson: Lesson
  onClose?: () => void
}

export function PreparedLessonItem({
  currentLesson,
  onClose,
}: PreparedLessonItemProps) {
  const { userLocale } = useUserLocale()
  const { currentLessonHolder } = useCurrentHolder()
  const { setDrafts } = useDrafts()
  const { selectedForUpdating } = usePlanLessons()
  const isUpdating = selectedForUpdating?.id === currentLesson.id

  function insertLesson() {
    if (!currentLessonHolder) return
    const fieldType = currentLessonHolder.type === 's' ? 'studentId' : 'groupId'
    setDrafts((prev) => {
      const filteredDrafts = prev.filter(
        (draft) => draft[fieldType] !== currentLessonHolder.holder.id,
      )
      return [...filteredDrafts, currentLesson]
    })
    toast.success('Geplante Lektion eingefügt.')
    onClose?.()
  }

  return (
    <div
      className={cn(
        isUpdating ? 'border-primary shadow-sm' : 'border-hairline',
        'rounded-sm border  p-3',
      )}
    >
      <div className='flex items-start justify-between'>
        <p className='mb-1 text-xs'>
          {currentLesson?.date?.toLocaleDateString(userLocale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </p>

        <div className='flex items-center gap-6 md:gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger onClick={insertLesson} className='w-full'>
                <BetweenHorizonalStart className='mr-2 h-4 w-4 text-primary' />
              </TooltipTrigger>
              <TooltipContent side='left'>
                <p>Lektion einfügen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PlannedLessonDropdown
            insertLesson={insertLesson}
            lessonId={currentLesson.id}
          />
        </div>
      </div>
      <div className={cn('md:grid-cols-2 grid gap-6')}>
        <div>
          <p>Lektion</p>
          <div
            data-testid='lessons-prev-lesson'
            className='break-words text-sm text-foreground [&_a:link]:underline [&_ol]:ml-[16px] [&_ol]:list-decimal [&_ul]:ml-[16px] [&_ul]:list-disc'
          >
            {parse(removeHTMLAttributes(currentLesson.lessonContent || '—'))}
          </div>
        </div>
        <div>
          <p>Hausaufgaben</p>
          <div
            data-testid='lessons-prev-homework'
            className='break-words text-sm text-foreground [&_ol]:ml-[16px] [&_ol]:list-decimal [&_ul]:ml-[16px] [&_ul]:list-disc'
          >
            {parse(removeHTMLAttributes(currentLesson.homework || '—'))}
          </div>
        </div>
      </div>
    </div>
  )
}
