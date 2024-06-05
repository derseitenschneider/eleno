import { useEffect, useState } from "react"
import { FaTelegramPlane } from "react-icons/fa"
import { HiCheck, HiOutlineClipboard, HiOutlineMail } from "react-icons/hi"
import { IoLogoWhatsapp } from "react-icons/io5"
import { MdOutlineTextsms } from "react-icons/md"
import { SiThreema } from "react-icons/si"

import { useUserLocale } from "@/services/context/UserLocaleContext"
import type { Lesson, Student } from "@/types/types"
import { useQueryClient } from "@tanstack/react-query"
import { useUser } from "../../../services/context/UserContext"
import { useParams, useSearchParams } from "react-router-dom"

interface ShareHomeworkProps {
  lessonId: number
}

function ShareHomework({ lessonId }: ShareHomeworkProps) {
  const { user } = useUser()
  const { userLocale } = useUserLocale()
  const { studentId } = useParams()
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
    "all-lessons",
    { studentId: Number(studentId), year: Number(searchParams.get("year")) },
  ]) as Array<Lesson> | undefined

  const latestLessons = queryClient.getQueryData(["latest-3-lessons"]) as
    | Array<Lesson>
    | undefined

  const combinedLessons: Array<Lesson> = []
  if (allLessons) combinedLessons.push(...allLessons)
  if (latestLessons) combinedLessons.push(...latestLessons)

  const students = queryClient.getQueryData(["students"]) as
    | Array<Student>
    | undefined
  const currentLesson = combinedLessons?.find(
    (lesson) => lesson.id === lessonId,
  )
  const currentStudent = students?.find(
    (student) => student.id === Number(studentId),
  )

  const lessonDate = currentLesson?.date.toLocaleDateString(userLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
  const url = `https://api.eleno.net/homework/${currentLesson?.studentId}/${currentLesson?.homeworkKey}`

  const subjectText = `Hausaufgaben ${currentStudent?.instrument} vom ${lessonDate}`
  const bodyText = `Hallo ${currentStudent?.firstName}%0D%0A %0D%0AUnter folgendem Link findest du deine Hausaufgaben vom ${lessonDate}: %0D%0A %0D%0A${url} %0D%0A %0D%0ALiebe Grüsse  %0D%0A${user?.firstName} ${user?.lastName}`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url)
    setIsCopied(true)
  }
  return (
    <div className='text-sm share-homework'>
      <p className='mb-6'>
        Mit diesem Link kann{" "}
        <b>
          {currentStudent?.firstName} {currentStudent?.lastName}
        </b>{" "}
        auf die Hausaufgaben vom <b>{lessonDate}</b> zugreifen:
      </p>
      <div className='flex items-center gap-2 mb-8'>
        <a href={url} target='_blank' rel='noreferrer'>
          {url}
        </a>{" "}
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
          </a>{" "}
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
