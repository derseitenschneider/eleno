import { useUserLocale } from '@/services/context/UserLocaleContext'
import parse from 'html-react-parser'
import type { Lesson } from '@/types/types'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import { cn } from '@/lib/utils'
import PrepareLessonDropDown from './PrepareLessonDropDown.component'
import { usePrepLessons } from '@/services/context/LessonPrepContext'
import { Button } from '@/components/ui/button'
import { BetweenHorizonalStart } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export type PreparedLessonItemProps = {
  currentLesson: Lesson
  onClose?: () => void
}

export function PreparedLessonItem({
  currentLesson,
  onClose,
}: PreparedLessonItemProps) {
  const { userLocale } = useUserLocale()
  const { selectedForUpdating, setSelectedForUsing } = usePrepLessons()
  const isUpdating = selectedForUpdating?.id === currentLesson.id

  return (
    <div
      className={cn(
        isUpdating ? 'border-primary' : 'border-hairline',
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
              <TooltipTrigger
                onClick={() => {
                  setSelectedForUsing(currentLesson)
                  onClose?.()
                }}
                className='w-full'
              >
                <BetweenHorizonalStart className='mr-2 h-4 w-4 text-primary' />
              </TooltipTrigger>
              <TooltipContent side='left'>
                <p>Lektion einfügen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PrepareLessonDropDown
            onClose={onClose}
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
