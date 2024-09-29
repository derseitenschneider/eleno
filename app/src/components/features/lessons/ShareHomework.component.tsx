import { useEffect, useState } from 'react'
import { FaTelegramPlane } from 'react-icons/fa'
import { HiCheck, HiOutlineClipboard, HiOutlineMail } from 'react-icons/hi'
import { IoLogoWhatsapp } from 'react-icons/io5'
import { MdOutlineTextsms } from 'react-icons/md'
import { SiThreema } from 'react-icons/si'

import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { Lesson, Student } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
import { useUser } from '../../../services/context/UserContext'
import { useParams, useSearchParams } from 'react-router-dom'
import { useLessonHolders } from '@/services/context/LessonHolderContext'

interface ShareHomeworkProps {
  lessonId: number
}

function ShareHomework({ lessonId }: ShareHomeworkProps) {
  const { user } = useUser()
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

  const lessonDate = currentLesson?.date.toLocaleDateString(userLocale, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
  const url = `https://api.eleno.net/homework/${currentLesson?.studentId || currentLesson?.groupId}/${currentLesson?.homeworkKey}`

  const subjectText = `Hausaufgaben ${currentHolder?.type === 's' ? currentHolder.holder.instrument : currentHolder?.holder.name} vom ${lessonDate}`
  let bodyText = ''
  if (currentHolder && currentHolder.type === 's') {
    bodyText = `Hallo ${holderName}%0D%0A %0D%0AUnter folgendem Link findest du deine Hausaufgaben vom ${lessonDate}: %0D%0A %0D%0A${url} %0D%0A %0D%0ALiebe Grüsse  %0D%0A${user?.first_name} ${user?.last_name}`
  } else {
    bodyText = `Hallo ${holderName}%0D%0A %0D%0AUnter folgendem Link findet ihr eure Hausaufgaben vom ${lessonDate}: %0D%0A %0D%0A${url} %0D%0A %0D%0ALiebe Grüsse  %0D%0A${user?.first_name} ${user?.last_name}`
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url)
    setIsCopied(true)
  }
  if (!currentHolder) return null
  return (
    <div className='text-sm share-homework'>
      <p className='mb-6'>
        Mit diesem Link kann{' '}
        <b>
          {currentHolder.type === 's'
            ? `${currentHolder.holder.firstName} ${currentHolder.holder.lastName}`
            : currentHolder.holder.name}{' '}
        </b>{' '}
        auf die Hausaufgaben vom <b>{lessonDate}</b> zugreifen:
      </p>
      <div className='flex items-center gap-2 mb-8'>
        <a href={url} target='_blank' rel='noreferrer'>
          {url}
        </a>{' '}
        <button type='button' title='Link kopieren' onClick={copyToClipboard}>
          {isCopied ? <HiCheck color='green' /> : <HiOutlineClipboard />}
        </button>
      </div>

      <div className='flex justify-between'>
        <p>Link direkt verschicken:</p>
        <div className='flex items-center gap-4'>
          <a
            href={`https://t.me/share/url?url=${url}&text=${bodyText}`}
            title='Link per Telegram verschicken'
            target='_blank'
            className='text-[#2aabee]'
            rel='noreferrer'
          >
            <FaTelegramPlane className='h-5 w-5' />
          </a>
          <a
            href={`https://threema.id/compose?text=${bodyText}`}
            title='Link per Threema verschicken'
            target='_blank'
            className='text-foreground'
            rel='noreferrer'
          >
            <SiThreema className='h-5 w-5' />
          </a>
          <a
            href={`https://wa.me/?text=${bodyText}`}
            title='Link per Whatsapp verschicken'
            target='_blank'
            rel='noreferrer'
            className='text-[#25d366]'
          >
            <IoLogoWhatsapp className='h-5 w-5' />
          </a>{' '}
          <a
            href={`sms://?&body=${bodyText}`}
            title='Link per SMS verschicken'
            className='text-foreground'
          >
            <MdOutlineTextsms className='h-5 w-5' />
          </a>
          <a
            href={`mailto:?subject=${subjectText}&body=${bodyText}`}
            title='Link per E-Mail verschicken'
            className='text-foreground'
          >
            <HiOutlineMail className='h-5 w-5' />
          </a>
        </div>
      </div>
    </div>
  )
}

export default ShareHomework
