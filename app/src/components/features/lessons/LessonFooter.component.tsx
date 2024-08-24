import SearchStudentCombobox from '../students/SearchStudentCombobox.component'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLatestLessons } from './lessonsQueries'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import getNewestLessonYear from '@/utils/getNewestLessonYear'
import { useState } from 'react'
import { cn } from '@/lib/utils'

function LessonFooter() {
  const [isScrolling, setIsScrolling] = useState(false)
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
  window.addEventListener('scroll', () => {
    setIsScrolling(true)
  })

  window.addEventListener('scrollend', () => {
    setTimeout(() => {
      setIsScrolling(false)
    }, 750)
  })
  if (lessonHolderTypeIds.length <= 1) return null

  return (
    <footer
      className={cn(
        'fixed md:bottom-0 bottom-16 px-3 py-3 right-0 transition-transform duration-500',
        isScrolling ? 'translate-x-[80%]' : 'translate-x-0',
      )}
    >
      <div className='shadow-xl bg-background200/25 border border-background50 flex gap-3 p-2 backdrop-blur-sm rounded-full'>
        <SearchStudentCombobox />
        <Button
          onMouseDown={handlerPreviousStudent}
          size='icon'
          className='bg-primary rounded-full hover:translate-y-[-1px] shadow-md transition-transform '
        >
          <ArrowLeft className='h-5 w-5 text-white' />
        </Button>

        <Button
          onMouseDown={handlerNextStudent}
          size='icon'
          className='bg-primary shadow-md rounded-full hover:translate-y-[-1px] transition-transform '
        >
          <ArrowRight className='h-5 w-5 text-white' />
        </Button>
      </div>
    </footer>
  )
}

export default LessonFooter
