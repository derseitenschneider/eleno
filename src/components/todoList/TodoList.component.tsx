import './todoList.style.scss'
import { FunctionComponent, useRef, useState } from 'react'
import { TTodo } from '../../types/types'
import TodoItem from '../todoItem/TodoItem.component'
import Button from '../button/Button.component'
import TodoAddItem from '../todoAddItem/TodoAddItem.component'
import { useTodos } from '../../contexts/TodosContext'

import NoContent from '../noContent/NoContent.component'
import Modal from '../modals/Modal.component'
interface TodoListProps {
  todos: TTodo[]
  listType: 'open' | 'completed'
}

const TodoList: FunctionComponent<TodoListProps> = ({ todos, listType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { deleteAllCompleted } = useTodos()

  return (
    <div className="todo-list">
      {listType === 'completed' && todos.length ? (
        <div className="container--buttons todo__delete-all-btn">
          <Button
            label="Alle löschen"
            type="button"
            handler={() => setIsModalOpen(true)}
            btnStyle="danger"
          />
        </div>
      ) : (
        <div></div>
      )}
      <div className="todos">
        {listType === 'open' && <TodoAddItem />}

        {todos?.length ? (
          <>
            {listType === 'open' && (
              <div className="description">
                <div></div>
                <div></div>
                <h5 className="heading-5">Schüler:in</h5>
                <h5 className="heading-5">fällig</h5>
              </div>
            )}

            <ul className="todo-list">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} listType={listType} />
              ))}
            </ul>
          </>
        ) : (
          <NoContent
            heading={`Aktuell keine ${
              listType === 'open' ? 'offenen' : 'erledigten'
            } Todos`}
          />
        )}
      </div>
      {isModalOpen && (
        <Modal
          heading="Todos löschen?"
          handlerClose={() => setIsModalOpen(false)}
          handlerOverlay={() => setIsModalOpen(false)}
          buttons={[
            {
              label: 'Abbrechen',
              btnStyle: 'primary',
              handler: () => setIsModalOpen(false),
            },
            {
              label: 'Alle löschen',
              btnStyle: 'danger',
              handler: () => {
                deleteAllCompleted()
                setIsModalOpen(false)
              },
            },
          ]}
        >
          <p>Alle erledigten Todos werden unwiederruflich gelöscht.</p>
        </Modal>
      )}
    </div>
  )
}

export default TodoList
