interface TodoListProps {
  children?: React.ReactNode
}

function TodoList({ children }: TodoListProps) {
  return (
    <div className='todo-list'>
      <div className='todos'>{children}</div>
    </div>
  )
}

export default TodoList
