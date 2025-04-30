import parse from 'html-react-parser'
import { cn } from '@/lib/utils'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import ButtonShareHomework from './ButtonShareHomework.component'
import PreviousLessonDropDown from './PreviousLessonDropDown.component'
import { useLatestLessons } from './lessonsQueries'
import { useUserLocale } from '@/services/context/UserLocaleContext'

export function PreviousLessonItem({ lessonId }: { lessonId: number }) {
  const { data: lessons } = useLatestLessons()
  const { userLocale } = useUserLocale()
  const currentLesson = lessons?.find((lesson) => lesson.id === lessonId)
  if (!currentLesson) return null
  return (
    <div className='rounded-sm border border-hairline p-3'>
      <div className='flex items-start justify-between'>
        <p className='mb-1 text-xs'>
          {currentLesson.date.toLocaleDateString(userLocale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </p>

        <div className='flex items-center gap-6 md:gap-4'>
          <ButtonShareHomework lessonId={lessonId} />
          <PreviousLessonDropDown lessonId={lessonId} />
        </div>
      </div>
      <div className={cn('grid md:grid-cols-2 gap-6')}>
        <div>
          <p>Lektion</p>
          <div
            data-testid='lessons-prev-lesson'
            className='text-sm text-foreground [&_a:link]:underline [&_ol]:ml-[16px] [&_ol]:list-decimal [&_ul]:ml-[16px] [&_ul]:list-disc'
          >
            {parse(removeHTMLAttributes(currentLesson.lessonContent || '—'))}
          </div>
        </div>
        <div>
          <p>Hausaufgaben</p>
          <div
            data-testid='lessons-prev-homework'
            className='text-sm text-foreground [&_ol]:ml-[16px] [&_ol]:list-decimal [&_ul]:ml-[16px] [&_ul]:list-disc'
          >
            {parse(removeHTMLAttributes(currentLesson.homework || '—'))}
          </div>
        </div>
      </div>
    </div>
  )
}
