import { useEffect, useState } from 'react'
import { FaTelegramPlane } from 'react-icons/fa'
import { HiCheck, HiOutlineClipboard, HiOutlineMail } from 'react-icons/hi'
import { IoLogoWhatsapp } from 'react-icons/io5'
import { MdOutlineTextsms } from 'react-icons/md'
import { SiThreema } from 'react-icons/si'

import { appConfig } from '@/config'
import { cn } from '@/lib/utils'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { Lesson } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import useProfileQuery from '../user/profileQuery'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Info, XIcon } from 'lucide-react'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { Button } from '@/components/ui/button'
import { useAuthorizeGroupHomeworkLink } from '../students/useAuthorizeGroupsHomeworkLink'
import { useAuthorizeStudentHomeworkLink } from '../students/useAuthorizeStudentsHomeworkLink'

interface ShareHomeworkProps {
  lessonId: number
}

// TODO: Cleanup component, make custom hook for business logic etc.
function ShareHomework({ lessonId }: ShareHomeworkProps) {
  const { data: userProfile } = useProfileQuery()
  const { authorizeStudent, isAuthorizingStudents } =
    useAuthorizeStudentHomeworkLink()
  const { authorizeGroup, isAuthorizingGroup } = useAuthorizeGroupHomeworkLink()
  const { userLocale } = useUserLocale()
  const { activeSortedHolders } = useLessonHolders()
  const { holderId } = useParams()
  const [searchParams] = useSearchParams()
  const [isOpenCollapsible, setIsOpenCollapsible] = useState(false)

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
  const url = `${appConfig.apiUrl}/homework/${currentLesson?.studentId || currentLesson?.groupId}/${currentLesson?.homeworkKey}`

  const subjectText = `Hausaufgaben ${currentHolder?.type === 's' ? currentHolder.holder.instrument : currentHolder?.holder.name} vom ${lessonDate}`
  let bodyText = ''
  if (currentHolder && currentHolder.type === 's') {
    bodyText = `Hallo ${holderName}%0D%0A %0D%0AUnter folgendem Link findest du deine Hausaufgaben vom ${lessonDate}: %0D%0A %0D%0A${url} %0D%0A %0D%0ALiebe Grüsse  %0D%0A${userProfile?.first_name} ${userProfile?.last_name}`
  } else {
    bodyText = `Hallo ${holderName}%0D%0A %0D%0AUnter folgendem Link findet ihr eure Hausaufgaben vom ${lessonDate}: %0D%0A %0D%0A${url} %0D%0A %0D%0ALiebe Grüsse  %0D%0A${userProfile?.first_name} ${userProfile?.last_name}`
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url)
    setIsCopied(true)
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

  if (!currentHolder) return null
  return (
    <div className={cn('w-[600px] relative text-sm')}>
      {appConfig.isDemoMode ? (
        <p className='text-base'>
          Diese Funktion ist in der Demoversion leider nicht verfügbar.
        </p>
      ) : (
        <>
          <Collapsible open={isOpenCollapsible}>
            <Label
              htmlFor='authorization'
              className='flex cursor-pointer items-center gap-1'
            >
              <Checkbox
                id='authorization'
                checked={sharingAuthorized}
                onCheckedChange={handleShareAuthorization}
              />
              Einwilligung zum Teilen bestätigt
              <CollapsibleTrigger
                onClick={() => setIsOpenCollapsible((prev) => !prev)}
              >
                <Info className='mb-[2px] text-primary' size={17} />
              </CollapsibleTrigger>
            </Label>
            <CollapsibleContent>
              <div className='mt-3 rounded-md bg-primary/15 px-4 py-5'>
                <Button
                  className='absolute right-2 top-11 h-4'
                  size='sm'
                  onClick={() => setIsOpenCollapsible(false)}
                  variant='ghost'
                >
                  <XIcon />
                </Button>
                <p className='text-sm/6'>
                  Mit dem Setzen dieser Checkbox bestätigst du, dass:
                </p>
                <ul className='list-inside list-disc py-3 leading-5'>
                  <li> diese Schüler:innen volljährig sind, ODER </li>
                  <li>
                    {' '}
                    du die ausdrückliche Einwilligung der Erziehungsberechtigten
                    hast, Hausaufgaben über einen Weblink zu teilen.{' '}
                  </li>
                </ul>
                <p>
                  {' '}
                  Diese Einstellung ist erforderlich, um die Hausaufgaben-Links
                  zu aktivieren und dient dem Schutz minderjähriger
                  Schüler:innen gemäss{' '}
                  <a
                    href='https://eleno.net/terms-conditions/#sharing-homework'
                    target='_blank'
                    rel='noreferrer'
                    className=''
                  >
                    Allgemeiner Geschäftsbedingungen
                  </a>
                  .
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          {sharingAuthorized && (
            <div
              className={cn(
                isAuthorizingStudents ||
                  (isAuthorizingGroup && 'opacity-50 pointer-events-none'),
              )}
            >
              <p className='mt-4'>
                Mit diesem Link kann{' '}
                <b>
                  {currentHolder.type === 's'
                    ? `${currentHolder.holder.firstName} ${currentHolder.holder.lastName}`
                    : currentHolder.holder.name}{' '}
                </b>{' '}
                auf die Hausaufgaben vom <b>{lessonDate}</b> zugreifen:
              </p>
              <div className='mb-6 mt-2 flex items-center gap-2'>
                <a href={url} target='_blank' rel='noreferrer'>
                  {url}
                </a>{' '}
                <button
                  type='button'
                  title='Link kopieren'
                  onClick={copyToClipboard}
                >
                  {isCopied ? (
                    <HiCheck color='green' />
                  ) : (
                    <HiOutlineClipboard />
                  )}
                </button>
              </div>

              <div className='flex justify-between'>
                <p>Link direkt verschicken:</p>{' '}
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
          )}
        </>
      )}
    </div>
  )
}

export default ShareHomework
