import { useLessons } from '../../../../contexts/LessonsContext'
import './shareHomework.style.scss'

interface ShareHomeworkProps {
  lessonId: number
  studentId: number
}

function ShareHomework({ lessonId, studentId }: ShareHomeworkProps) {
  const { lessons } = useLessons()
  const { homeworkKey } = lessons.find((lesson) => lesson.id === lessonId)

  const url = `https://eleno.vercel.app/${studentId}/${homeworkKey}`

  console.log(lessons)
  return (
    <div className="share-homework">
      <h1 className="heading-2">Hausaufgaben teilen</h1>
      <p>{url}</p>
    </div>
  )
}

export default ShareHomework
