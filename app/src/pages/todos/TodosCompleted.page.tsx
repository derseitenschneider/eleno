import { FunctionComponent, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import NoContent from '../../components/common/noContent/NoContent.component'
import fetchErrorToast from '../../hooks/fetchErrorToast'
import TodoList from '../../components/todos/todoList/TodoList.component'
import { useTodos } from '../../contexts/TodosContext'
import Button from '../../components/common/button/Button.component'
import TodoItem from '../../components/todos/todoItem/TodoItem.component'
import TodoDescription from '../../components/todos/todoDescription/TodoDescription.component'
import Modal from '../../components/common/modal/Modal.component'
import DeleteTodos from '../../components/todos/deleteTodos/DeleteTodos.component'

const TodosCompleted = () => {
  const { todos } = useTodos()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { deleteAllCompleted } = useTodos()
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handlerDeleteAll = async () => {
    setIsPending(true)
    try {
      await deleteAllCompleted()
      setIsModalOpen(false)
      toast('Todos wurden gelöscht')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  const completedTodos = todos.filter((todo) => todo.completed)

  return (
    <TodoList>
      {completedTodos.length > 0 ? (
        <>
          <div className="container--buttons todo__delete-all-btn">
            <Modal>
              <Modal.Open opens="delete-all-todos">
                <Button label="Alle löschen" btnStyle="danger" />
              </Modal.Open>
              <Modal.Window name="delete-all-todos">
                <DeleteTodos />
              </Modal.Window>
            </Modal>
          </div>

          <TodoDescription />

          <ul>
            {completedTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} type="completed" />
            ))}
          </ul>
        </>
      ) : (
        <NoContent heading="Aktuell keine erledigten Todos" />
      )}

      {/* {isModalOpen && (
        <Modal
          heading="Todos löschen?"
          handlerClose={() => setIsModalOpen(false)}
          className={isPending ? 'loading' : ''}
          buttons={[
            {
              label: 'Abbrechen',
              btnStyle: 'primary',
              handler: () => setIsModalOpen(false),
            },
            {
              label: 'Alle löschen',
              btnStyle: 'danger',
              handler: handlerDeleteAll,
            },
          ]}
        >
          <p>Alle erledigten Todos werden unwiederruflich gelöscht.</p>
        </Modal>
      )} */}
    </TodoList>
  )
}

export default TodosCompleted
