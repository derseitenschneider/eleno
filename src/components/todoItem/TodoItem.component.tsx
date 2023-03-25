import './todoItem.style.scss'
import { FunctionComponent } from 'react'
import { TTodo } from '../../types/types'
import { formatDateToDisplay } from '../../utils/formateDate'
import { useStudents } from '../../contexts/StudentContext'
interface TodoItemProps {
  todo: TTodo
}

const TodoItem: FunctionComponent<TodoItemProps> = ({ todo }) => {
  const { students } = useStudents()

  const [attachedStudent] = students.filter(
    (student) => student.id === todo.studentId
  )

  return (
    <li className="todo-item">
      <input type="checkbox" />
      <div className="wrapper-text">
        <h4 className="heading-4">{todo.title}</h4>
        {todo.details && <p>{todo.details}</p>}
      </div>
      <div className="wrapper-due">
        {todo.due && <p>{formatDateToDisplay(todo.due)}</p>}
      </div>
      <div className="wrapper-student">
        {attachedStudent && (
          <p className="student">
            {attachedStudent.firstName} {attachedStudent.lastName}
          </p>
        )}
      </div>
    </li>
  )
}

export default TodoItem
