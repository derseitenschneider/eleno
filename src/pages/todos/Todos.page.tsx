import { Outlet } from 'react-router-dom'
import { useClosestStudent } from '../../contexts/ClosestStudentContext'
import { useDateToday } from '../../contexts/DateTodayContext'
import { useStudents } from '../../contexts/StudentContext'
import { useTodos } from '../../contexts/TodosContext'
import { useUser } from '../../contexts/UserContext'
import Navbar from '../../layouts/navbar/Navbar.component'
function TodosOpen() {
  const { todos, setTodos } = useTodos()
  const { students } = useStudents()
  const { user } = useUser()
  const { setClosestStudentIndex } = useClosestStudent()
  const { dateToday } = useDateToday()

  // [ ] don't save empty todos
  return (
    <div className="container">
      <h1 className="heading-1">ToDos</h1>

      <Navbar
        navLinks={[
          { path: '', label: 'Offen', key: 0, end: true },
          { path: 'completed', label: 'Erledigt', key: 1, end: true },
        ]}
      />
      <Outlet
        context={{
          todos,
          setTodos,
          students,
          user,
          setClosestStudentIndex,
          dateToday,
        }}
      />
    </div>
  )
}
export default TodosOpen
