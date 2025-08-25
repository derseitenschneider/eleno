import type { CheckedState } from '@radix-ui/react-checkbox'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthorizeGroupHomeworkLink } from '@/components/features/students/useAuthorizeGroupsHomeworkLink'
import { useAuthorizeStudentHomeworkLink } from '@/components/features/students/useAuthorizeStudentsHomeworkLink'
import useProfileQuery from '@/components/features/user/profileQuery'
import { appConfig } from '@/config'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { Lesson } from '@/types/types'

export function useShareHomework(lessonId: number) {
  const { data: userProfile } = useProfileQuery()
  const { authorizeStudent, isAuthorizingStudents } =
    useAuthorizeStudentHomeworkLink()
  const { authorizeGroup, isAuthorizingGroup } = useAuthorizeGroupHomeworkLink()
  const { userLocale } = useUserLocale()
  const { activeSortedHolders } = useLessonHolders()
  const { holderId } = useParams()
  const [searchParams] = useSearchParams()

  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 5000)
    }
  }, [isCopied])

  const queryClient = useQueryClient()
  const allLessons = queryClient.getQueryData([
    'all-lessons',
    { holder: holderId, year: Number(searchParams.get('year')) },
  ]) as Array<Lesson> | undefined

  const latestLessons = queryClient.getQueryData(['latest-3-lessons']) as
    | Array<Lesson>
    | undefined

  const combinedLessons: Array<Lesson> = []
  if (allLessons) combinedLessons.push(...allLessons)
  if (latestLessons) combinedLessons.push(...latestLessons)

  const currentLesson = combinedLessons?.find(
    (lesson) => lesson.id === lessonId,
  )
  const currentHolder = activeSortedHolders?.find((holder) => {
    const type = holderId?.split('-').at(0)
    const id = holderId?.split('-').at(1)
    return (
      holder.type === type && holder.holder.id === Number.parseInt(id || '')
    )
  })

  const holderName =
    currentHolder?.type === 's'
      ? currentHolder?.holder.firstName
      : currentHolder?.holder.name

  const sharingAuthorized = currentHolder?.holder.homework_sharing_authorized

  const lessonDate = currentLesson?.date.toLocaleDateString(userLocale, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
  const url = `${appConfig.apiUrl}/homework/${
    currentLesson?.studentId || currentLesson?.groupId
  }/${currentLesson?.homeworkKey}`

  const subjectText = `Hausaufgaben ${
    currentHolder?.type === 's'
      ? currentHolder.holder.instrument
      : currentHolder?.holder.name
  } vom ${lessonDate}`
  let bodyText = ''
  if (currentHolder && currentHolder.type === 's') {
    bodyText = `Hallo ${holderName}%0D%0A %0D%0AUnter folgendem Link findest du deine Hausaufgaben vom ${lessonDate}: %0D%0A %0D%0A${url} %0D%0A %0D%0ALiebe Grüsse  %0D%0A${userProfile?.first_name} ${userProfile?.last_name}`
  } else {
    bodyText = `Hallo ${holderName}%0D%0A %0D%0AUnter folgendem Link findet ihr eure Hausaufgaben vom ${lessonDate}: %0D%0A %0D%0A${url} %0D%0A %0D%0ALiebe Grüsse  %0D%0A${userProfile?.first_name} ${userProfile?.last_name}`
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url)
    setIsCopied(true)
    toast.success('Link kopiert')
  }

  function handleShareAuthorization(checked: CheckedState) {
    if (!currentHolder) return

    if (currentHolder?.type === 's') {
      authorizeStudent([
        {
          ...currentHolder.holder,
          homework_sharing_authorized: Boolean(checked),
        },
      ])
    }
    if (currentHolder.type === 'g') {
      authorizeGroup({
        ...currentHolder.holder,
        homework_sharing_authorized: Boolean(checked),
      })
    }
  }
  return {
    currentHolder,
    sharingAuthorized,
    isAuthorizingStudents,
    isAuthorizingGroup,
    handleShareAuthorization,
    url,
    isCopied,
    lessonDate,
    copyToClipboard,
    bodyText,
    subjectText,
  }
}
