import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useGroupsQuery from '@/components/features/groups/groupsQuery'
import NoStudents from '@/components/features/lessons/NoStudents.component'
import useCurrentHolder from '@/components/features/lessons/useCurrentHolder'
import useSettingsQuery from '@/components/features/settings/settingsQuery'
import useStudentsQuery from '@/components/features/students/studentsQueries'
import useNavigateToHolder from '@/hooks/useNavigateToHolder'
import { cn } from '@/lib/utils'
import CreateLesson from '../components/features/lessons/CreateLesson.component'
import PreviousLessons from '../components/features/lessons/PreviousLessons.component'
import NoteList from '../components/features/notes/NoteList.component'
import { useLessonHolders } from '../services/context/LessonHolderContext'
import { useLoading } from '../services/context/LoadingContext'

function Lesson() {
  const { isLoading } = useLoading()
  const { data: settings } = useSettingsQuery()
  const { currentLessonHolder } = useCurrentHolder()
  const { currentLessonHolder: contextCurrentHolder, activeSortedHolders } =
    useLessonHolders()
  const { isLoading: isLoadingStudents } = useStudentsQuery()
  const { isLoading: isLoadingGroups } = useGroupsQuery()
  const { navigateToNearestHolder } = useNavigateToHolder()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentHolderId = `${currentLessonHolder?.type}-${currentLessonHolder?.holder.id}`

  useEffect(() => {
    // Skip if still loading data
    if (isLoadingStudents || isLoadingGroups) return

    // Handle searchParams navigation
    const studentParam = searchParams.get('student')
    if (studentParam) {
      if (studentParam === 'current') {
        // Navigate to the student closest to current date/time
        navigateToNearestHolder()
        return
      }
      // Direct student ID provided (e.g., s-123)
      navigate(`/lessons/${studentParam}`, { replace: true })
    } else if (!currentLessonHolder) {
      // No searchParams and no current holder from route params
      // Check if we have any students at all
      if (activeSortedHolders && activeSortedHolders.length > 0) {
        // Navigate to the current holder from context or first student
        const targetHolder = contextCurrentHolder || activeSortedHolders[0]
        if (targetHolder) {
          const holderId = `${targetHolder.type}-${targetHolder.holder.id}`
          navigate(`/lessons/${holderId}`, { replace: true })
        }
      }
    }
  }, [
    isLoadingStudents,
    isLoadingGroups,
    currentLessonHolder,
    contextCurrentHolder,
    activeSortedHolders,
    navigate,
    navigateToNearestHolder,
    searchParams,
  ])

  if (isLoading || !settings) return <p>...loading</p>
  if (currentLessonHolder)
    return (
      <div
        key={currentHolderId}
        className={cn(
          'lg:grid lg:grid-cols-[2fr_minmax(0,380px)] overflow-auto [@media(min-height:800px)_and_(min-width:1200px)]:overflow-y-hidden',
        )}
      >
        <main
          className={cn(
            'lg:h-full',
            'flex flex-col [@media(min-height:800px)]:overflow-hidden',
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
