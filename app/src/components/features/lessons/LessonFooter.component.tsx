import SearchStudentCombobox from '../students/SearchStudentCombobox.component'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLatestLessons } from './lessonsQueries'
import type { Lesson } from '@/types/types'
import { useLessonPointer } from '@/services/context/LessonPointerContext'

function LessonFooter() {
  const { lessonPointer, setLessonPointer, lessonHolderTypeIds } =
    useLessonPointer()
  const navigate = useNavigate()
  const { holderId } = useParams()
  const { data: latestLessons } = useLatestLessons()

  if (!latestLessons || !holderId) return null

  function getNewestLessonYear(latestLessons: Array<Lesson>, holderId: string) {
    const [type, id] = holderId.split('-')

    if (!type || !id) return null

    let field: 'studentId' | 'groupId'
    if (type === 's') field = 'studentId'
    if (type === 'g') field = 'groupId'

    return latestLessons
      ?.filter((lesson) => lesson?.[field] === Number(id))
      .sort((a, b) => b.date.valueOf() - a.date.valueOf())
      .at(0)
      ?.date.getFullYear()
  }

  const handlerPreviousStudent = () => {
    if (lessonPointer > 0) {
      const newPointer = lessonPointer - 1
      const prevHolderId = lessonHolderTypeIds[newPointer]
      setLessonPointer((prev) => prev - 1)
      if (!prevHolderId) return
      const newestYear =
        getNewestLessonYear(latestLessons, prevHolderId) ||
        new Date().getFullYear()

      const url = window.location.pathname
      const query = url.includes('all') ? `?year=${newestYear}` : ''
      const newUrl = url.replace(String(holderId), String(prevHolderId))

      navigate(newUrl + query)
    }

    if (lessonPointer === 0) {
      const newPointer = lessonHolderTypeIds.length - 1
      const lastHolderId = lessonHolderTypeIds[newPointer]
      setLessonPointer(newPointer)

      if (!lastHolderId) return
      const newestYear =
        getNewestLessonYear(latestLessons, lastHolderId) ||
        new Date().getFullYear()
      const url = window.location.pathname
      const query = url.includes('all') ? `?year=${newestYear}` : ''
      const newUrl = url.replace(String(holderId), String(lastHolderId))
      navigate(newUrl)
      navigate(newUrl + query)
    }
  }

  const handlerNextStudent = () => {
    if (lessonPointer < lessonHolderTypeIds.length - 1) {
      const newPointer = lessonPointer + 1
      const nextHolderId = lessonHolderTypeIds[newPointer]
      setLessonPointer((prev) => prev + 1)
      if (!nextHolderId) return
      const newestYear =
        getNewestLessonYear(latestLessons, nextHolderId) ||
        new Date().getFullYear()
      const url = window.location.pathname
      const query = url.includes('all') ? `?year=${newestYear}` : ''
      const newUrl = url.replace(String(holderId), String(nextHolderId))
      navigate(newUrl + query)
    }
    if (lessonPointer === lessonHolderTypeIds.length - 1) {
      const newPointer = 0
      const firstHolderId = lessonHolderTypeIds[newPointer]
      setLessonPointer(newPointer)
      if (!firstHolderId) return
      const newestYear =
        getNewestLessonYear(latestLessons, firstHolderId) ||
        new Date().getFullYear()
      const url = window.location.pathname
      const query = url.includes('all') ? `?year=${newestYear}` : ''
      const newUrl = url.replace(String(holderId), String(firstHolderId))
      navigate(newUrl)
      navigate(newUrl + query)
    }
  }

  return (
    <footer className='fixed bottom-0 right-0 flex gap-4 px-8 py-5'>
      <SearchStudentCombobox />
      <Button
        onMouseDown={handlerPreviousStudent}
        size='icon'
        className='bg-background50 shadow-md rounded-full hover:bg-background50 hover:translate-y-[-2px] transition-transform '
      >
        <ArrowLeft className='h-5 w-5 text-primary' />
      </Button>

      <Button
        onMouseDown={handlerNextStudent}
        size='icon'
        className='bg-background50 shadow-md rounded-full hover:bg-background50 hover:translate-y-[-2px] transition-transform '
      >
        <ArrowRight className='h-5 w-5 text-primary' />
      </Button>
    </footer>
  )
}

export default LessonFooter
