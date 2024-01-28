import { useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { IoReturnDownBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDateToday } from '../../../../services/context/DateTodayContext'
import { useStudents } from '../../../../services/context/StudentContext'
import { TTodo } from '../../../../types/types'
import {
  formatDateToDatabase,
  formatDateToDisplay,
} from '../../../../utils/formateDate'
import { sortStudentsDateTime } from '../../../../utils/sortStudents'
import './todoItem.style.scss'

import { useTodos } from '../../../../services/context/TodosContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import Menus from '../../../ui/menu/Menus.component'
import Modal from '../../../ui/modal/Modal.component'
import DeleteTodos from '../deleteTodos/DeleteTodos.component'
import EditTodo from '../editTodo/EditTodo.component'

interface TodoItemProps {
  todo: TTodo
  type: 'open' | 'completed'
  children?: React.ReactNode
}

function TodoItem({ todo, type, children }: TodoItemProps) {
  const { students, setCurrentStudentIndex } = useStudents()
  const { completeTodo, reactivateTodo } = useTodos()
  const { dateToday } = useDateToday()
  const navigate = useNavigate()

  const [isPending, setIsPending] = useState(false)

  const [attachedStudent] = students.filter(
    (student) => student.id === todo.studentId,
  )
  const navigateToLesson = () => {
    const filteredSortedStudents = sortStudentsDateTime(students).filter(
      (student) => !student.archive,
    )
    const index = filteredSortedStudents.findIndex(
      (student) => student.id === todo.studentId,
    )

    setCurrentStudentIndex(index)

    navigate('/lessons')
  }

  const overdue = todo.due < formatDateToDatabase(dateToday)

  const handlerComplete = async () => {
    setIsPending(true)
    try {
      await completeTodo(todo.id)
      toast('Todo erledigt.')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  const handleReactivate = async () => {
    setIsPending(true)
    try {
      await reactivateTodo(todo.id)
      toast('Todo wiederhergestellt')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <li
      className={`todo-item${overdue ? ' overdue' : ''} ${
        isPending ? ' loading' : ''
      } `}
    >
      {children}
      {type === 'open' ? (
        <input
          type="checkbox"
          className="checkbox"
          onChange={handlerComplete}
          checked={false}
        />
      ) : (
        <div />
      )}
      <div className="wrapper-text">
        <span className="">{todo.text}</span>
      </div>
      <div className="wrapper-student">
        {attachedStudent && (
          <button type="button" className="student" onClick={navigateToLesson}>
            {attachedStudent.firstName} {attachedStudent.lastName}
          </button>
        )}
      </div>
      <div className="wrapper-due">
        {todo.due && (
          <span className={`${overdue ? 'overdue' : null}`}>
            {formatDateToDisplay(todo.due)}
          </span>
        )}
      </div>
      <div className="container--button">
        {type === 'open' && (
          <>
            <Menus.Toggle id={todo.id} />
            <Menus.Menu>
              <Menus.List id={todo.id}>
                <Modal.Open opens="edit-todo">
                  <Menus.Button icon={<HiPencil />}>Bearbeiten</Menus.Button>
                </Modal.Open>
              </Menus.List>
            </Menus.Menu>
            <Modal.Window name="edit-todo" styles={{ overflowY: 'visible' }}>
              <EditTodo todoId={todo.id} />
            </Modal.Window>
          </>
        )}
        {type === 'completed' && (
          <Modal>
            <Menus>
              <Menus.Toggle id={todo.id} />
              <Menus.Menu>
                <Menus.List id={todo.id}>
                  <Menus.Button
                    icon={<IoReturnDownBackOutline />}
                    onClick={handleReactivate}
                  >
                    Wiederherstellen
                  </Menus.Button>
                  <Modal.Open opens="delete-todo">
                    <Menus.Button
                      iconColor="var(--clr-warning)"
                      icon={<HiTrash />}
                    >
                      Löschen
                    </Menus.Button>
                  </Modal.Open>
                </Menus.List>
              </Menus.Menu>
            </Menus>

            <Modal.Window name="delete-todo">
              <DeleteTodos todoId={todo.id} />
            </Modal.Window>
          </Modal>
        )}
      </div>
    </li>
  )
}

export default TodoItem
