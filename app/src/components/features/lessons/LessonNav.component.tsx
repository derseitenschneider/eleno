import { cn } from '@/lib/utils'
import SearchStudentCombobox from '../students/SearchStudentCombobox.component'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useLatestLessons } from './lessonsQueries'
import { useCallback, useEffect, useState } from 'react'
import useCurrentHolder from './useCurrentHolder'
import { buildAllLessonsQuery } from '@/utils/buildAllLessonsQuery'

export default function LessonNav() {
  const { currentLessonHolder } = useCurrentHolder()
  const [isScrolling, setIsScrolling] = useState(false)
  const {
    setCurrentLessonPointer: setLessonPointer,
    activeSortedHolderTypeIds: lessonHolderTypeIds,
    currentLessonPointer,
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
    if (!currentLessonHolder) return
    const currentPath = window.location.pathname

    // We take the currentHolder from the url param and calculate the next
    // lessonHolder from there instead of the also available lessonPointer.
    //
    // The lessonPointer can be out of sync because of the useEffect
    // in the lessonHolderContexet that calculates the current student.
    // This calculation might happen on browser tab refocus between students
    // which makes the lessonPointer out of sync with the url.
    const currentHolderTypeId = `${currentLessonHolder.type}-${currentLessonHolder.holder.id}`
    const currentHolderIndex = lessonHolderTypeIds.indexOf(currentHolderTypeId)

    if (currentHolderIndex > 0) {
      const newPointer = currentHolderIndex - 1
      const prevHolderId = lessonHolderTypeIds[newPointer]
      setLessonPointer((prev) => prev - 1)
      if (!prevHolderId) return

      const query = buildAllLessonsQuery(
        currentPath,
        latestLessons,
        prevHolderId,
      )

      const newUrl = currentPath.replace(String(holderId), String(prevHolderId))

      return navigate(newUrl + query)
    }

    if (currentHolderIndex === 0) {
      const newPointer = lessonHolderTypeIds.length - 1
      const lastHolderId = lessonHolderTypeIds[newPointer]
      setLessonPointer(newPointer)

      if (!lastHolderId) return
      const query = buildAllLessonsQuery(
        currentPath,
        latestLessons,
        lastHolderId,
      )

      const newUrl = currentPath.replace(String(holderId), String(lastHolderId))

      navigate(newUrl + query)
    }
  }

  const handlerNextStudent = () => {
    window.scrollTo(0, 0)
    if (!currentLessonHolder) return
    const currentPath = window.location.pathname

    // We take the currentHolder from the url param and calculate the next
    // lessonHolder from there instead of the also available lessonPointer.
    //
    // The lessonPointer can be out of sync because of the useEffect
    // in the lessonHolderContexet that calculates the current student.
    // This calculation might happen on browser tab refocus between students
    // which makes the lessonPointer out of sync with the url.
    const currentHolderTypeId = `${currentLessonHolder.type}-${currentLessonHolder.holder.id}`
    const currentHolderIndex = lessonHolderTypeIds.indexOf(currentHolderTypeId)

    if (currentHolderIndex < lessonHolderTypeIds.length - 1) {
      const newPointer = currentHolderIndex + 1

      const nextHolderId = lessonHolderTypeIds[newPointer]
      setLessonPointer(newPointer)
      if (!nextHolderId) return

      const query = buildAllLessonsQuery(
        currentPath,
        latestLessons,
        nextHolderId,
      )

      const newUrl = currentPath.replace(String(holderId), String(nextHolderId))
      navigate(newUrl + query)
    }

    if (currentHolderIndex === lessonHolderTypeIds.length - 1) {
      const newPointer = 0
      const firstHolderId = lessonHolderTypeIds[newPointer]
      setLessonPointer(newPointer)
      if (!firstHolderId) return

      const query = buildAllLessonsQuery(
        currentPath,
        latestLessons,
        firstHolderId,
      )

      const newUrl = currentPath.replace(
        String(holderId),
        String(firstHolderId),
      )
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
