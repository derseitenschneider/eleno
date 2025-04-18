import { useEffect } from 'react'
import useGroupsQuery from '../../components/features/groups/groupsQuery'
import { useLatestLessons } from '../../components/features/lessons/lessonsQueries'
import { useActiveNotesQuery } from '../../components/features/notes/notesQueries'
import useStudentsQuery from '../../components/features/students/studentsQueries'
import useTodosQuery from '../../components/features/todos/todosQuery'
import Banner from '../../components/ui/Banner.component'
import { useLoading } from './LoadingContext'
import useMessagesQuery from '@/components/features/messages/messagesQueries'
import useFeatureFlagQuery from '@/components/features/flags/featureFlagsQuery'
import useSubscriptionQuery from '@/components/features/subscription/subscriptionQuery'
import useProfileQuery from '@/components/features/user/profileQuery'

interface DataProviderProps {
  children: React.ReactNode
}

function DataProvider({ children }: DataProviderProps) {
  const { setIsLoading } = useLoading()

  const { isLoading: isLoadingStudents } = useStudentsQuery()
  const { isLoading: isLoadingGroups } = useGroupsQuery()
  const { isLoading: isLoadingLatestLessons } = useLatestLessons()
  const { isLoading: isLoadingTodos } = useTodosQuery()
  const { isLoading: isLoadingNotes } = useActiveNotesQuery()
  const { isLoading: isLoadingMessages } = useMessagesQuery()
  const { isLoading: isLoadingFeatureFlags } = useFeatureFlagQuery()
  const { isLoading: isLoadingSubscription } = useSubscriptionQuery()
  const { isLoading: isLoadingProfile } = useProfileQuery()

  useEffect(() => {
    const compoundIsLoading =
      isLoadingStudents ||
      isLoadingGroups ||
      isLoadingLatestLessons ||
      isLoadingTodos ||
      isLoadingNotes ||
      isLoadingMessages ||
      isLoadingFeatureFlags ||
      isLoadingSubscription ||
      isLoadingProfile ||
      false
    setIsLoading(compoundIsLoading)
  }, [
    setIsLoading,
    isLoadingStudents,
    isLoadingGroups,
    isLoadingLatestLessons,
    isLoadingTodos,
    isLoadingNotes,
    isLoadingMessages,
    isLoadingFeatureFlags,
    isLoadingSubscription,
    isLoadingProfile,
  ])

  return (
    <>
      <Banner />
      <div id='main'>{children}</div>
    </>
  )
}

export default DataProvider
