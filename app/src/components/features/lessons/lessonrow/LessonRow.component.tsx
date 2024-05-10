import parse from "html-react-parser"
import type { Lesson } from "../../../../types/types"
import { formatDateToDisplay } from "../../../../utils/formateDate"

interface LessonRowProps {
  lesson: Lesson
}

function LessonRow({ lesson }: LessonRowProps) {
  return (
    <div className='all-lessons__row'>
      <div className='date'>{formatDateToDisplay(lesson.date)}</div>
      <div className='content'>{parse(lesson.lessonContent)}</div>
      <div className='content'>{parse(lesson.homework)}</div>
    </div>
  )
}

export default LessonRow
