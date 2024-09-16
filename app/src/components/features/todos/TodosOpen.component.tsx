import { useEffect } from 'react'
import CreateTodo from './CreateTodo.component'
import TodoDescription from './TodoDescription.component'
import compareDateTodos from '../../../utils/sortTodos'
import useTodosQuery from '@/components/features/todos/todosQuery'
import TodoItem from './TodoItem.component'
import Empty from '@/components/ui/Empty.component'

export default function TodosOpen() {
  const { data: todos, isPending } = useTodosQuery()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const openTodos = todos?.filter((todo) => !todo.completed)

  const todosWithDue = openTodos?.filter((todo) => todo.due).sort()

  const todosWithoutDue = openTodos?.filter((todo) => !todo.due)

  const sortedFilteredTodos = [
    ...(todosWithDue ? todosWithDue : []),
    ...(todosWithoutDue ? todosWithoutDue : []),
  ].sort(compareDateTodos)

  if (isPending) return <p>...loading</p>

  return (
    <div>
      <CreateTodo />
      {openTodos && openTodos?.length > 0 ? (
        <>
          <TodoDescription />
          <ul className='pt-4 sm:pt-0'>
            {sortedFilteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} type='open' />
            ))}
          </ul>
        </>
      ) : (
        <Empty className='mt-8' emptyMessage=' Keine offenen Todos vorhanden.'>
          <p>Erfasse neue Todos...</p>
        </Empty>
      )}
    </div>
  )
}
