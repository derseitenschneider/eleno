import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { useNavigate } from 'react-router-dom'

export default function useNavigateToHolder() {
  const navigate = useNavigate()
  const {
    currentLessonHolder,
    nearestLessonHolder,
    nearestLessonPointer,
    setCurrentLessonPointer,
    activeSortedHolderTypeIds,
  } = useLessonHolders()

  function navigateToCurrentHolder() {
    let slug = 'no-student'
    if (currentLessonHolder) {
      slug = `${currentLessonHolder.type}-${currentLessonHolder.holder.id}`
    }
    navigate(`/lessons/${slug}`)
  }

  function navigateToNearestHolder() {
    const slug = nearestLessonHolder?.holder
      ? `${nearestLessonHolder.type}-${nearestLessonHolder.holder.id}`
      : 'no-students'

    navigate(`/lessons/${slug}`)
    setCurrentLessonPointer(nearestLessonPointer)
  }

  function navigateToHolder(holderId: `${'s' | 'g'}-${number}`, slug = '') {
    const holderIndex = activeSortedHolderTypeIds.indexOf(holderId)
    let url = `/lessons/${holderId}`
    if (slug !== '') url += `/${slug}`
    navigate(url)
    setCurrentLessonPointer(holderIndex)
  }

  return {
    navigateToCurrentHolder,
    navigateToNearestHolder,
    navigateToHolder,
  }
}
