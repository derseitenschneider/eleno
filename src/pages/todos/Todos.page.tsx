import { Outlet } from 'react-router-dom'
import { useStudents } from '../../contexts/StudentContext'
import { useTodos } from '../../contexts/TodosContext'
import Navbar from '../../layouts/navbar/Navbar.component'
function TodosOpen() {
  const { todos, setTodos } = useTodos()
  const { students } = useStudents()

  return (
    <div className="container">
      <h1 className="heading-1">ToDos</h1>

      <Navbar
        navLinks={[
          { path: '', label: 'Offen', key: 0, end: true },
          { path: 'completed', label: 'Erledigt', key: 1, end: true },
        ]}
      />
      <Outlet context={{ todos, setTodos, students }} />
    </div>
  )
}
export default TodosOpen
