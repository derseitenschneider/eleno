import { FunctionComponent, useEffect, useState } from 'react'
import { fetchStudents } from '../../supabase/students/students.supabase'
import { useStudents } from '../../contexts/StudentContext'
import { fetchLatestLessonsSupabase } from '../../supabase/lessons/lessons.supabase'
import { useLessons } from '../../contexts/LessonsContext'
import { fetchNotes } from '../../supabase/notes/notes.supabase'
import { useNotes } from '../../contexts/NotesContext'
import { fetchTodosSupabase } from '../../supabase/todos/todos.supabase'
import { useTodos } from '../../contexts/TodosContext'
import Loader from '../loader/Loader'
import { useUser } from '../../contexts/UserContext'

interface MainProps {
  children: React.ReactNode
}

const Main: FunctionComponent<MainProps> = ({ children }) => {
  const { user } = useUser()
  // const { loading, setLoading } = useLoading()
  const [isPending, setIsPending] = useState(true)
  const { setStudents } = useStudents()
  const { setLessons } = useLessons()
  const { setNotes } = useNotes()
  const { setTodos } = useTodos()

  useEffect(() => {
    if (user) {
      const allPromise = Promise.all([
        fetchStudents(user.id),
        fetchLatestLessonsSupabase(user.id),
        fetchNotes(user.id),
        fetchTodosSupabase(user.id),
      ])
      const fetchAll = async () => {
        try {
          const [students, lessons, notes, todos] = await allPromise
          setStudents([...students])
          setLessons([...lessons])
          setNotes([...notes])
          setTodos([...todos])

          setIsPending(false)
        } catch (err) {
          console.log(err)
          setIsPending(false)
        }
      }
      fetchAll()
    }
  }, [user])

  return (
    <>
      {isPending ? (
        <Loader loading={isPending} />
      ) : (
        <div id="main">{children}</div>
      )}
    </>
  )
}

export default Main
