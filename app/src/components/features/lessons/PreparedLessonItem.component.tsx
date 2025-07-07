import { useUserLocale } from '@/services/context/UserLocaleContext'
import parse from 'html-react-parser'
import type { Lesson } from '@/types/types'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import { cn } from '@/lib/utils'

export function PreparedLessonItem({
  currentLesson,
}: { currentLesson: Lesson }) {
  const { userLocale } = useUserLocale()

  return (
    <div className='rounded-sm border border-hairline p-3'>
      <div className='flex items-start justify-between'>
        <p className='mb-1 text-xs'>
          {currentLesson?.date?.toLocaleDateString(userLocale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </p>

        <div className='flex items-center gap-6 md:gap-4'>
          {/* <ButtonInsertPreparedLesson lessonId={lessonId} /> */}
          {/* <PreviousLessonDropDown lessonId={lessonId} /> */}
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
