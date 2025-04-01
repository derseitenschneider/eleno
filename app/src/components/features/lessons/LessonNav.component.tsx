import { cn } from '@/lib/utils'
import SearchStudentCombobox from '../students/SearchStudentCombobox.component'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useLatestLessons } from './lessonsQueries'
import { useCallback, useEffect, useState } from 'react'
import getNewestLessonYear from '@/utils/getNewestLessonYear'

export default function LessonNav() {
  const [isScrolling, setIsScrolling] = useState(false)
  const {
    currentLessonPointer: lessonPointer,
    setCurrentLessonPointer: setLessonPointer,
    activeSortedHolderTypeIds: lessonHolderTypeIds,
  } = useLessonHolders()
  const navigate = useNavigate()
  const { holderId } = useParams()
  const { data: latestLessons } = useLatestLessons()

  const handleScroll = useCallback(() => {
    if (!isScrolling) {
      setIsScrolling(true)
      setTimeout(() => setIsScrolling(false), 450)
    }
  }, [isScrolling])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  if (!latestLessons || !holderId) return null

  const handlerPreviousStudent = () => {
    window.scrollTo(0, 0)
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
    window.scrollTo(0, 0)
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

  if (lessonHolderTypeIds.length <= 1) return null
  return (
    <div
      className={cn(
        'fixed md:bottom-3 bottom-[76px]',
        'ml-auto md:ml-0 right-4 transition-transform duration-500',
        isScrolling && window.innerWidth < 1000
          ? 'translate-x-[calc(100%-8px)]'
          : '',
      )}
    >
      <div className='flex gap-2 rounded-full border border-hairline bg-background50/30 p-2 shadow-sm backdrop-blur-sm'>
        <SearchStudentCombobox />
        <Button
          onMouseDown={handlerPreviousStudent}
          size='icon'
          className='rounded-full border border-hairline bg-background50 shadow-sm transition-transform  hover:bg-background200/40'
        >
          <ArrowLeft className='h-5 w-5 text-primary' />
        </Button>

        <Button
          onMouseDown={handlerNextStudent}
          size='icon'
          className='rounded-full border border-hairline bg-background50 shadow-sm transition-transform  hover:bg-background200/40 '
        >
          <ArrowRight className='h-5 w-5 text-primary' />
        </Button>
      </div>
    </div>
  )
}
