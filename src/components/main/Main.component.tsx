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
import OfflineBanner from '../offlineBanner/OfflineBanner.component'

interface MainProps {
  children: React.ReactNode
}

const Main: FunctionComponent<MainProps> = ({ children }) => {
  const { user } = useUser()
  // const { loading, setLoading } = useLoading()
  const [isPending, setIsPending] = useState(true)
  const { setStudents, students } = useStudents()
  const { setLessons } = useLessons()
  const { setNotes, notes } = useNotes()
  const { setTodos } = useTodos()
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    if (user) {
      const allPromise = Promise.all([
        fetchStudents(user.id),
        fetchLatestLessonsSupabase(user.id),
        fetchNotes(),
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

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', handleStatusChange)
    window.addEventListener('offline', handleStatusChange)

    return () => {
      window.removeEventListener('online', handleStatusChange)
      window.removeEventListener('offline', handleStatusChange)
    }
  }, [isOnline])

  return (
    <>
      {isPending ? (
        <Loader loading={isPending} />
      ) : (
        <div id="main">{children}</div>
      )}
      {!isOnline && <OfflineBanner />}
    </>
  )
}

export default Main
