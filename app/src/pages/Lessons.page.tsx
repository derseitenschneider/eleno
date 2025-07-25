import NoStudents from '@/components/features/lessons/NoStudents.component'
import useCurrentHolder from '@/components/features/lessons/useCurrentHolder'
import CreateLesson from '../components/features/lessons/CreateLesson.component'
import PreviousLessons from '../components/features/lessons/PreviousLessons.component'
import NoteList from '../components/features/notes/NoteList.component'
import { useLoading } from '../services/context/LoadingContext'
import { cn } from '@/lib/utils'
import useHasBanner from '@/hooks/useHasBanner'
import useSettingsQuery from '@/components/features/settings/settingsQuery'

function Lesson() {
  const { isLoading } = useLoading()
  const { data: settings } = useSettingsQuery()
  const hasBanner = useHasBanner()
  const { currentLessonHolder } = useCurrentHolder()
  const currentHolderId = `${currentLessonHolder?.type}-${currentLessonHolder?.holder.id}`

  if (isLoading || !settings) return <p>...loading</p>
  if (currentLessonHolder)
    return (
      <div
        key={currentHolderId}
        className={cn(
          'lg:grid lg:grid-cols-[2fr_minmax(0,380px)] overflow-scroll lg:overflow-hidden',
        )}
      >
        <main
          className={cn(
            hasBanner ? 'lg:h-[calc(100%-32px)]' : 'lg:h-full',
            'flex flex-col lg:overflow-hidden',
          )}
        >
          {settings.lesson_main_layout === 'regular' ? (
            <>
              <CreateLesson />
              <PreviousLessons layout={settings.lesson_main_layout} />
            </>
          ) : (
            <>
              <PreviousLessons layout={settings.lesson_main_layout} />
              <CreateLesson />
            </>
          )}
        </main>

        <aside className='border-l border-hairline lg:h-full'>
          <NoteList />
        </aside>
      </div>
    )

  return <NoStudents />
}

export default Lesson
