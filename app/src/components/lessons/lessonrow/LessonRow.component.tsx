import { FunctionComponent } from 'react'
import { formatDateToDisplay } from '../../../utils/formateDate'
import { TLesson } from '../../../types/types'
import parse from 'html-react-parser'
interface LessonRowProps {
  lesson: TLesson
}

const LessonRow: FunctionComponent<LessonRowProps> = ({ lesson }) => {
  return (
    <div className="lesson-row">
      <div className="date">{formatDateToDisplay(lesson.date)}</div>
      <div className="content">{parse(lesson.lessonContent)}</div>
      <div className="content">{parse(lesson.homework)}</div>
    </div>
  )
}

export default LessonRow
