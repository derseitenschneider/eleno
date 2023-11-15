import { useEffect } from 'react'

import Button from '../../components/ui/button/Button.component'
import Modal from '../../components/ui/modal/Modal.component'
import NoContent from '../../components/ui/noContent/NoContent.component'
import DeleteTodos from '../../components/features/todos/deleteTodos/DeleteTodos.component'
import TodoDescription from '../../components/features/todos/todoDescription/TodoDescription.component'
import TodoItem from '../../components/features/todos/todoItem/TodoItem.component'
import TodoList from '../../components/features/todos/todoList/TodoList.component'
import { useTodos } from '../../services/context/TodosContext'

function TodosCompleted() {
  const { todos } = useTodos()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const completedTodos = todos.filter((todo) => todo.completed)

  return (
    <TodoList>
      {completedTodos.length > 0 ? (
        <>
          <div className="container--buttons todo__delete-all-btn">
            <Modal>
              <Modal.Open opens="delete-all-todos">
                <Button type="button" label="Alle löschen" btnStyle="danger" />
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
    </TodoList>
  )
}

export default TodosCompleted
