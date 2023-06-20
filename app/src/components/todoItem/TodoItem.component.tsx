import './todoItem.style.scss'
import { FunctionComponent, useState, useEffect } from 'react'
import { TTodo } from '../../types/types'
import {
  formatDateToDatabase,
  formatDateToDisplay,
} from '../../utils/formateDate'
import { useStudents } from '../../contexts/StudentContext'
import { sortStudentsDateTime } from '../../utils/sortStudents'
import { useClosestStudent } from '../../contexts/ClosestStudentContext'
import { useNavigate } from 'react-router-dom'
import { useDateToday } from '../../contexts/DateTodayContext'
import Button from '../button/Button.component'
import { IoEllipsisVertical } from 'react-icons/io5'
import DropDown from '../dropdown/Dropdown.component'
import Modal from '../modals/Modal.component'
import ModalEditTodo from '../modals/modalEditTodo/ModalEditTodo.component'
import { useTodos } from '../../contexts/TodosContext'
import { toast } from 'react-toastify'
import fetchErrorToast from '../../hooks/fetchErrorToast'

interface TodoItemProps {
  todo: TTodo
  type: 'open' | 'completed'
  children?: React.ReactNode
}

const TodoItem: FunctionComponent<TodoItemProps> = ({
  todo,
  type,
  children,
}) => {
  const { students, setStudentIndex } = useStudents()
  const { completeTodo, reactivateTodo, deleteTodo } = useTodos()
  const { dateToday } = useDateToday()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

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

    setStudentIndex(index)

    navigate('/lessons')
  }

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('.button--edit') as HTMLElement
      if (!button) setDropdownOpen(false)
      // if (+button?.dataset.id !== studentId) setDropdownOpen(false)
    }
    if (dropdownOpen) {
      window.addEventListener('click', closeDropdown)
    }
    return () => {
      window.removeEventListener('click', closeDropdown)
    }
  }, [dropdownOpen])

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

  const handlerReactivate = async () => {
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

  const handlerDelete = async () => {
    setIsPending(true)
    try {
      await deleteTodo(todo.id)
      setModalDeleteOpen(false)
      toast('Todo gelöscht.')
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
        <div></div>
      )}
      <div className="wrapper-text">
        <span className="">{todo.text}</span>
      </div>
      <div className="wrapper-student">
        {attachedStudent && (
          <span className="student" onClick={navigateToLesson}>
            {attachedStudent.firstName} {attachedStudent.lastName}
          </span>
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
        <Button
          type="button"
          btnStyle="icon-only"
          icon={<IoEllipsisVertical />}
          className="button--edit"
          handler={() => setDropdownOpen((prev) => !prev)}
        />
        {dropdownOpen && type === 'open' && (
          <DropDown
            positionX="right"
            positionY="top"
            buttons={[
              {
                label: 'Bearbeiten',
                type: 'normal',
                handler: () => {
                  setModalEditOpen((prev) => !prev)
                },
              },
            ]}
          />
        )}

        {dropdownOpen && type === 'completed' && (
          <DropDown
            positionX="right"
            positionY="top"
            buttons={[
              {
                label: 'Auf offen setzen',
                type: 'normal',
                handler: handlerReactivate,
              },
              {
                label: 'Löschen',
                type: 'warning',
                handler: () => {
                  setModalDeleteOpen(true)
                },
              },
            ]}
          />
        )}
      </div>
      {modalEditOpen && (
        <ModalEditTodo
          closeModal={() => setModalEditOpen(false)}
          todoId={todo.id}
        />
      )}

      {modalDeleteOpen && (
        <Modal
          heading="Todo löschen?"
          handlerOverlay={() => setModalDeleteOpen(false)}
          handlerClose={() => setModalDeleteOpen(false)}
          className={isPending ? 'loading' : ''}
          buttons={[
            {
              label: 'Abbrechen',
              btnStyle: 'primary',
              handler: () => setModalDeleteOpen(false),
            },
            {
              label: 'Löschen',
              btnStyle: 'danger',
              handler: handlerDelete,
            },
          ]}
        >
          <span>Die Todo wird unwiederruflich gelöscht.</span>
        </Modal>
      )}
    </li>
  )
}

export default TodoItem
