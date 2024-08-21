import SearchStudentCombobox from '../students/SearchStudentCombobox.component'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLatestLessons } from './lessonsQueries'
import type { Lesson } from '@/types/types'
import { useLessonHolders } from '@/services/context/LessonPointerContext'
import getNewestLessonYear from '@/utils/getNewestLessonYear'

function LessonFooter() {
  const {
    currentLessonPointer: lessonPointer,
    setCurrentLessonPointer: setLessonPointer,
    activeSortedHolderTypeIds: lessonHolderTypeIds,
  } = useLessonHolders()
  const navigate = useNavigate()
  const { holderId } = useParams()
  const { data: latestLessons } = useLatestLessons()

  if (!latestLessons || !holderId) return null

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
      navigate(newUrl + query)
    }
  }

  return (
    <footer className='fixed md:bottom-0 bottom-16 right-0 px-3 py-3'>
      <div className='shadow-xl bg-background200/25 border border-background50 flex gap-3 p-2 backdrop-blur-sm rounded-full'>
        <SearchStudentCombobox />
        <Button
          onMouseDown={handlerPreviousStudent}
          size='icon'
          className='bg-background50 rounded-full hover:bg-background50 hover:translate-y-[-1px] shadow-md transition-transform '
        >
          <ArrowLeft className='h-5 w-5 text-primary' />
        </Button>

        <Button
          onMouseDown={handlerNextStudent}
          size='icon'
          className='bg-background50 shadow-md rounded-full hover:bg-background50 hover:translate-y-[-1px] transition-transform '
        >
          <ArrowRight className='h-5 w-5 text-primary' />
        </Button>
      </div>
    </footer>
  )
}

export default LessonFooter
