import { useLessonHolders } from '@/services/context/LessonPointerContext'
import getNewestLessonYear from '@/utils/getNewestLessonYear'
import { useNavigate, useParams } from 'react-router-dom'
import { useLatestLessons } from './lessonsQueries'

export default function useNavigateNextStudent() {
  const {
    currentLessonPointer,
    setCurrentLessonPointer,
    activeSortedHolderTypeIds,
  } = useLessonHolders()
  const { holderId } = useParams()
  const navigate = useNavigate()
  const { data: latestLessons } = useLatestLessons()

  if (currentLessonPointer > 0) {
    setCurrentLessonPointer((prev) => prev - 1)
    const previousHolderId =
      activeSortedHolderTypeIds[currentLessonPointer] ?? ''

    const newestYear =
      getNewestLessonYear(latestLessons, previousHolderId) ||
      new Date().getFullYear()

    const url = window.location.pathname
    const query = url.includes('all') ? `?year=${newestYear}` : ''
    const newUrl = url.replace(String(holderId), String(previousHolderId))

    navigate(newUrl + query)
  }

  if (currentLessonPointer === 0) {
    setCurrentLessonPointer(activeSortedHolderTypeIds.length - 1)
    const lastStudentId = activeSortedHolderTypeIds[currentLessonPointer] ?? ''
    const newestYear =
      getNewestLessonYear(latestLessons, lastStudentId) ||
      new Date().getFullYear()
    const url = window.location.pathname
    const query = url.includes('all') ? `?year=${newestYear}` : ''
    const newUrl = url.replace(String(holderId || ''), String(lastStudentId))
    navigate(newUrl)
    navigate(newUrl + query)
    return setCurrentLessonPointer(activeSortedHolderTypeIds.length - 1)
  }
}
