import { FunctionComponent } from 'react'
import { formatDateToDisplay } from '../../utils/formateDate'
import { TLesson } from '../../types/types'
interface LessonRowProps {
  lesson: TLesson
}

// [ ] check linebreak (f.e. Anina)
const LessonRow: FunctionComponent<LessonRowProps> = ({ lesson }) => {
  return (
    <div className="lesson-row">
      <p className="date">{formatDateToDisplay(lesson.date)}</p>
      <p className="content">{lesson.lessonContent}</p>
      <p className="content">{lesson.homework}</p>
    </div>
  )
}

export default LessonRow
