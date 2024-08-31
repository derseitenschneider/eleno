import {
  BookMarked,
  CheckSquare2,
  GraduationCap,
  Settings,
  UserRoundPlus,
} from 'lucide-react'
import { useLessonHolders } from '../../../../services/context/LessonHolderContext'
import QuickLinkItem from './QuickLinkItem.component'
import { cn } from '@/lib/utils'

function QuickLinks() {
  const { nearestLessonHolder, nearestLessonPointer, setCurrentLessonPointer } =
    useLessonHolders()

  const lessonSlug = nearestLessonHolder?.holder
    ? `${nearestLessonHolder.type}-${nearestLessonHolder.holder.id}`
    : 'no-students'

  function setCurrentStudent() {
    setCurrentLessonPointer(nearestLessonPointer)
  }

  return (
    <div
      className={cn(
        'px-5 py-6',
        'md:p-4 md:pl-6',
        'col-span-1 row-start-2 row-end-3 border-b border-hairline',
      )}
    >
      <h2>Quick-Links</h2>
      <div className='flex gap-x-8 gap-y-5 flex-wrap'>
        <QuickLinkItem
          onClick={setCurrentStudent}
          title='Unterricht starten'
          icon={<GraduationCap strokeWidth={1.5} />}
          link={`/lessons/${lessonSlug}`}
        />
        <QuickLinkItem
          title='Schüler:in hinzufügen'
          icon={<UserRoundPlus strokeWidth={1.5} />}
          link='students?modal=add-students'
          className='hidden md:flex'
        />
        <QuickLinkItem
          title='Todo erfassen'
          icon={<CheckSquare2 strokeWidth={1.5} />}
          link='todos'
        />
        <QuickLinkItem
          title='Einstellungen'
          icon={<Settings strokeWidth={1.5} />}
          link='settings'
        />
        <QuickLinkItem
          title='Anleitung'
          icon={<BookMarked strokeWidth={1.5} />}
          link='https://manual.eleno.net'
          target='_blank'
        />
      </div>
    </div>
  )
}

export default QuickLinks
