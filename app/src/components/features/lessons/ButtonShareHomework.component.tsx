import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { MessageSquareShare } from 'lucide-react'
import { useState } from 'react'
import ShareHomework from './ShareHomework.component'
import { useUser } from '@/services/context/UserContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useParams, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import type { Lesson } from '@/types/types'
import { useLessonHolders } from '@/services/context/LessonHolderContext'

type ButtonShareHomeworkProps = {
  lessonId: number
}

export default function ButtonShareHomework({
  lessonId,
}: ButtonShareHomeworkProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useUser()
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

  let bodyText = ''
  if (currentHolder && currentHolder.type === 's') {
    bodyText = `
Hallo ${holderName}

Hier ist der Link zu deinen Hausaufgaben vom ${lessonDate}.

Liebe Grüsse
${user?.firstName} ${user?.lastName}
`
  } else {
    bodyText = `Hallo ${holderName}

Hier ist der Link zu euren Hausaufgaben vom ${lessonDate}.

Liebe Grüsse  
${user?.firstName} ${user?.lastName}
`
  }

  const url = `https://api.eleno.net/homework/${currentLesson?.studentId}/${currentLesson?.homeworkKey}`

  async function handleClick() {
    if (!currentHolder) return
    if (navigator.share && window.innerWidth < 580) {
      try {
        await navigator.share({
          title: `Hausaufgaben ${currentHolder.type === 's' ? currentHolder.holder.instrument : currentHolder.holder.name} `,
          text: bodyText,
          url,
        })
      } catch (error) {}
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <Button
        onClick={handleClick}
        title='Hausaufgaben teilen'
        size='sm'
        variant='ghost'
        className='p-0'
      >
        <MessageSquareShare className='size-4 text-primary' />
      </Button>
      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent>
          <DialogTitle>Hausaufgaben teilen</DialogTitle>
          <ShareHomework lessonId={lessonId} />
        </DialogContent>
      </Dialog>
    </>
  )
}
