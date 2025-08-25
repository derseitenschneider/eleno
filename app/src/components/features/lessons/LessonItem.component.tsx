import parse from 'html-react-parser'
import { ChevronRightIcon } from 'lucide-react'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { cn } from '@/lib/utils'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { Lesson } from '@/types/types'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import ButtonShareHomework from './homework/ButtonShareHomework.component'
import PreviousLessonDropDown from './PreviousLessonDropDown.component'

export type LessonItemProps = {
  lesson: Lesson
  isDisplayOnly?: boolean
}

export function LessonItem({ lesson, isDisplayOnly }: LessonItemProps) {
  const isMobile = useIsMobileDevice()
  const { userLocale } = useUserLocale()

  if (!lesson) return

  return (
    <div
      data-testid='lesson-item'
      className='rounded-sm border border-hairline bg-background100 p-3'
    >
      {!isDisplayOnly && (
        <div className='flex items-start justify-between'>
          <p className='mb-1 text-xs'>
            {lesson.date.toLocaleDateString(userLocale, {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>

          <div className='flex items-center gap-6 md:gap-4'>
            {!isMobile ? (
              <>
                <ButtonShareHomework lessonId={lesson.id} />
                <PreviousLessonDropDown lessonId={lesson.id} />
              </>
            ) : (
              <ChevronRightIcon className='size-4 text-foreground/70' />
            )}
          </div>
        </div>
      )}
      <div className={cn('md:grid-cols-2 grid gap-6')}>
        <div>
          <p>Lektion</p>
          <div
            data-testid='lessons-prev-lesson'
            className='break-words text-sm text-foreground [&_a:link]:underline [&_ol]:ml-[16px] [&_ol]:list-decimal [&_ul]:ml-[16px] [&_ul]:list-disc'
          >
            {parse(removeHTMLAttributes(lesson.lessonContent || '—'))}
          </div>
        </div>
        <div>
          <p>Hausaufgaben</p>
          <div
            data-testid='lessons-prev-homework'
            className='break-words text-sm text-foreground [&_ol]:ml-[16px] [&_ol]:list-decimal [&_ul]:ml-[16px] [&_ul]:list-disc'
          >
            {parse(removeHTMLAttributes(lesson.homework || '—'))}
          </div>
        </div>
      </div>
    </div>
  )
}
