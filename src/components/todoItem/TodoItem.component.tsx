import './todoItem.style.scss'
import { FunctionComponent } from 'react'
import { TTodo } from '../../types/types'
import { formatDateToDisplay } from '../../utils/formateDate'
import { useStudents } from '../../contexts/StudentContext'
import { sortStudentsDateTime } from '../../utils/sortStudents'
import { useClosestStudent } from '../../contexts/ClosestStudentContext'
import { useNavigate } from 'react-router-dom'

interface TodoItemProps {
  todo: TTodo
  handleComplete: (todoId: number) => void
}

const TodoItem: FunctionComponent<TodoItemProps> = ({
  todo,
  handleComplete,
}) => {
  const { students } = useStudents()
  const { setClosestStudentIndex } = useClosestStudent()
  const navigate = useNavigate()

  const [attachedStudent] = students.filter(
    (student) => student.id === todo.studentId
  )
  const navigateToLesson = () => {
    const filteredSortedStudents = sortStudentsDateTime(students).filter(
      (student) => !student.archive
    )
    const index = filteredSortedStudents.findIndex(
      (student) => student.id === todo.studentId
    )

    setClosestStudentIndex(index)

    navigate('/lessons')
  }

  const onChangeComplete = () => {
    handleComplete(todo.id)
  }

  return (
    <li className="todo-item">
      <input type="checkbox" className="checkbox" onChange={onChangeComplete} />
      <div className="wrapper-text">
        <h4 className="heading-4">{todo.title}</h4>
        {todo.details && <p>{todo.details}</p>}
      </div>
      <div className="wrapper-due">
        {todo.due && <p>{formatDateToDisplay(todo.due)}</p>}
      </div>
      <div className="wrapper-student">
        {attachedStudent && (
          <p className="student" onClick={navigateToLesson}>
            {attachedStudent.firstName} {attachedStudent.lastName}
          </p>
        )}
      </div>
    </li>
  )
}

export default TodoItem
