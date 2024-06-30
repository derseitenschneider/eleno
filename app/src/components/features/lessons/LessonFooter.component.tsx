import { useStudents } from '../../../services/context/StudentContext'
import SearchStudentCombobox from '../students/SearchStudentCombobox.component'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLatestLessons } from './lessonsQueries'
import type { Lesson } from '@/types/types'

function LessonFooter() {
  const {
    activeSortedStudentIds,
    currentStudentIndex,
    setCurrentStudentIndex,
  } = useStudents()
  const navigate = useNavigate()
  const { studentId } = useParams()
  const currentStudentId = Number(studentId)
  const { data: latestLessons } = useLatestLessons()

  if (!latestLessons || !studentId) return null

  function getNewestLessonYear(
    latestLessons: Array<Lesson>,
    studentId: number,
  ) {
    return latestLessons
      ?.filter((lesson) => lesson?.studentId === Number(studentId))
      .sort((a, b) => b.date.valueOf() - a.date.valueOf())
      .at(0)
      ?.date.getFullYear()
  }

  const handlerPreviousStudent = () => {
    if (currentStudentIndex > 0) {
      const previousStudentId =
        activeSortedStudentIds[currentStudentIndex - 1] ?? 0
      const newestYear =
        getNewestLessonYear(latestLessons, previousStudentId) ||
        new Date().getFullYear()
      const url = window.location.pathname
      const query = url.includes('all') ? `?year=${newestYear}` : ''

      const newUrl = url.replace(
        String(currentStudentId),
        String(previousStudentId),
      )
      navigate(newUrl + query)
      return setCurrentStudentIndex(currentStudentIndex - 1)
    }
    const lastStudentId =
      activeSortedStudentIds[activeSortedStudentIds.length - 1] ?? 0
    const newestYear =
      getNewestLessonYear(latestLessons, lastStudentId) ||
      new Date().getFullYear()
    const url = window.location.pathname
    const query = url.includes('all') ? `?year=${newestYear}` : ''
    const newUrl = url.replace(String(currentStudentId), String(lastStudentId))
    navigate(newUrl)
    navigate(newUrl + query)
    return setCurrentStudentIndex(activeSortedStudentIds.length - 1)
  }

  const handlerNextStudent = () => {
    if (currentStudentIndex < activeSortedStudentIds.length - 1) {
      const nextStudentId = activeSortedStudentIds[currentStudentIndex + 1] ?? 0
      const newestYear =
        getNewestLessonYear(latestLessons, nextStudentId) ||
        new Date().getFullYear()
      const url = window.location.pathname
      const query = url.includes('all') ? `?year=${newestYear}` : ''
      const newUrl = url.replace(
        String(currentStudentId),
        String(nextStudentId),
      )
      navigate(newUrl + query)
      return setCurrentStudentIndex(currentStudentIndex + 1)
    }
    const firstStudentId = activeSortedStudentIds[0] ?? 0
    const newestYear =
      getNewestLessonYear(latestLessons, firstStudentId) ||
      new Date().getFullYear()
    const url = window.location.pathname
    const query = url.includes('all') ? `?year=${newestYear}` : ''
    const newUrl = url.replace(String(currentStudentId), String(firstStudentId))
    navigate(newUrl)
    navigate(newUrl + query)
    return setCurrentStudentIndex(0)
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
