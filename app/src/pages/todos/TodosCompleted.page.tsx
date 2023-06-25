import { FunctionComponent, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Modal from '../../components/modals/Modal.component'
import NoContent from '../../components/_reusables/noContent/NoContent.component'
import fetchErrorToast from '../../hooks/fetchErrorToast'
import TodoList from '../../components/todos/todoList/TodoList.component'
import { useTodos } from '../../contexts/TodosContext'
import Button from '../../components/_reusables/button/Button.component'
import TodoItem from '../../components/todos/todoItem/TodoItem.component'
import TodoDescription from '../../components/todos/todoDescription/TodoDescription.component'
interface TodosCompletedProps {}

const TodosCompleted: FunctionComponent<TodosCompletedProps> = () => {
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
            <Button
              label="Alle löschen"
              handler={() => setIsModalOpen(true)}
              btnStyle="danger"
            />
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

      {isModalOpen && (
        <Modal
          heading="Todos löschen?"
          handlerClose={() => setIsModalOpen(false)}
          handlerOverlay={() => setIsModalOpen(false)}
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
      )}
    </TodoList>
  )
}

export default TodosCompleted
