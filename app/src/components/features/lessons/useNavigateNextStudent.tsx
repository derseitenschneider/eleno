import { useLessonPointer } from '@/services/context/LessonPointerContext'
import { useNavigate, useParams } from 'react-router-dom'

export default function useNavigateNextStudent() {
  const { lessonPointer, setLessonPointer, lessonHolderTypeIds } =
    useLessonPointer()
  const { holderId } = useParams()
  const navigate = useNavigate()
  if (lessonPointer > 0) {
    setLessonPointer((prev) => prev - 1)
    const previousHolderId = lessonHolderTypeIds[lessonPointer] ?? 0

    const newestYear =
      getNewestLessonYear(latestLessons, previousHolderId) ||
      new Date().getFullYear()

    const url = window.location.pathname
    const query = url.includes('all') ? `?year=${newestYear}` : ''
    const newUrl = url.replace(String(holderId), String(previousHolderId))

    navigate(newUrl + query)
    // return setCurrentStudentIndex(currentStudentIndex - 1)
  }
  if (lessonPointer === 0) {
    setLessonPointer(lessonHolderTypeIds.length - 1)
    const lastStudentId = lessonHolderTypeIds[lessonPointer] ?? 0
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
}
