import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { useNavigate } from 'react-router-dom'

export default function useNavigateToCurrentHolder() {
  const navigate = useNavigate()
  const { currentLessonHolder } = useLessonHolders()

  let slug = 'no-student'

  if (currentLessonHolder) {
    slug = `${currentLessonHolder.type}-${currentLessonHolder.holder.id}`
  }

  return () => {
    navigate(`/lessons/${slug}`)
  }
}
