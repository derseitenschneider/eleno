import { useQueryClient } from '@tanstack/react-query'
import { MessageSquareShare } from 'lucide-react'
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  DrawerOrDialog,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { Lesson } from '@/types/types'
import { Blocker } from '../../subscription/Blocker'
import useProfileQuery from '../../user/profileQuery'
import { HomeworkExpired } from './HomeworkExpired.component'
import ShareHomework from './ShareHomework.component'

type ButtonShareHomeworkProps = {
  lessonId: number
}

export default function ButtonShareHomework({
  lessonId,
}: ButtonShareHomeworkProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: userProfile } = useProfileQuery()
  const { userLocale } = useUserLocale()
  const { activeSortedHolders } = useLessonHolders()
  const { holderId } = useParams()
  const [searchParams] = useSearchParams()

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

  if (!currentLesson) return null
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

  const lessonDate = currentLesson?.date.toLocaleDateString(userLocale, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })

  const expirationBase = new Date(currentLesson?.expiration_base || '')
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14) // Subtract 14 days

  const isExpired = expirationBase < twoWeeksAgo

  let bodyText = ''
  const url = `https://api.eleno.net/homework/${
    currentLesson?.studentId || currentLesson?.groupId
  }/${currentLesson?.homeworkKey}`
  if (currentHolder && currentHolder.type === 's') {
    bodyText = `
Hallo ${holderName}

Hier ist der Link zu deinen Hausaufgaben vom ${lessonDate}.

Liebe Grüsse
${userProfile?.first_name} ${userProfile?.last_name}
`
  } else {
    bodyText = `Hallo ${holderName}

Hier ist der Link zu euren Hausaufgaben vom ${lessonDate}.


Liebe Grüsse  
${userProfile?.first_name} ${userProfile?.last_name}\n\n
`
  }

  async function handleClick() {
    if (!currentHolder) return
    setIsModalOpen(true)
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={handleClick} className='p-0'>
            <MessageSquareShare className='size-4 text-primary' />
          </TooltipTrigger>
          <TooltipContent side='bottom'>
            <p>Hausaufgaben teilen</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DrawerOrDialog
        open={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
      >
        <DrawerOrDialogContent>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>
              {isExpired ? 'Dieser Link ist abgelaufen' : 'Hausaufgaben teilen'}
            </DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='hidden'>
            Teile die Hausaufgaben mit deinen Schüler:innen
          </DrawerOrDialogDescription>
          <Blocker />
          {isExpired ? (
            <HomeworkExpired currentLesson={currentLesson} />
          ) : (
            <ShareHomework lessonId={lessonId} />
          )}
        </DrawerOrDialogContent>
      </DrawerOrDialog>
    </>
  )
}
