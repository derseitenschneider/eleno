import './todoList.style.scss'
import { FunctionComponent, useState } from 'react'
import { TTodo } from '../../types/types'
import TodoItem from '../todoItem/TodoItem.component'
import { sortStudents } from '../../utils/sortStudents'
import Button from '../button/Button.component'
import TodoAddItem from '../todoAddItem/TodoAddItem.component'
import { useTodos } from '../../hooks/useTodos'
import {
  completeTodoSupabase,
  saveTodoSupabase,
} from '../../supabase/todos/todos.supabase'
import { toast } from 'react-toastify'
import NoContent from '../noContent/NoContent.component'
interface TodoListProps {
  todos: TTodo[]
  listType: 'open' | 'completed'
}

const TodoList: FunctionComponent<TodoListProps> = ({ todos, listType }) => {
  const { setTodos, deleteAllCompleted } = useTodos()

  // const { students } = useStudents()

  // const openTodos = todos.filter((todo) => !todo.completed)

  const saveTodo = async (newTodo: TTodo) => {
    const tempId = newTodo.id
    setTodos((prev) => [...prev, newTodo])
    try {
      const [data] = await saveTodoSupabase(newTodo)
      const newId = data.id
      setTodos((prev) =>
        prev.map((todo) => (todo.id === tempId ? { ...todo, id: newId } : todo))
      )
      toast('Todo erstellt')
    } catch (err) {
      console.log(err)
    }
  }

  const handleComplete = async (id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: true } : todo))
    )
    try {
      await completeTodoSupabase(id)
      toast('Todo erledigt')
    } catch (err) {}
  }

  return (
    <>
      {listType === 'completed' ? (
        <div className="container--buttons">
          <Button
            label="Alle löschen"
            type="button"
            handler={deleteAllCompleted}
            btnStyle="danger"
          />
        </div>
      ) : (
        <div></div>
      )}
      <div className="todos">
        {listType === 'open' && <TodoAddItem saveTodo={saveTodo} />}

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
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  handleComplete={handleComplete}
                  listType={listType}
                />
              ))}
            </ul>
          </>
        ) : (
          <NoContent heading="Aktuell keine offenen Todos" />
        )}
      </div>
    </>
  )
}

export default TodoList
