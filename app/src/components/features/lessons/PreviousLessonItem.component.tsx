import parse from 'html-react-parser'
import { cn } from '@/lib/utils'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import ButtonShareHomework from './homework/ButtonShareHomework.component'
import PreviousLessonDropDown from './PreviousLessonDropDown.component'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { ChevronRightIcon } from 'lucide-react'
import type { Lesson } from '@/types/types'

export type PreviousLessonItemProps = {
  lesson: Lesson
}

export function PreviousLessonItem({ lesson }: PreviousLessonItemProps) {
  const isMobile = useIsMobileDevice()
  const { userLocale } = useUserLocale()

  if (!lesson) return

  return (
    <div className='rounded-sm border border-hairline p-3'>
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
            <ChevronRightIcon className='size-5' />
          )}
        </div>
      </div>
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
