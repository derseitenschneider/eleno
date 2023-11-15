import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Loader from '../../components/ui/loader/Loader'
import OfflineBanner from '../../components/ui/offlineBanner/OfflineBanner.component'
import { useClosestStudent } from '../../services/context/ClosestStudentContext'
import { useLessons } from '../../services/context/LessonsContext'
import { useNotes } from '../../services/context/NotesContext'
import { useStudents } from '../../services/context/StudentContext'
import { useTodos } from '../../services/context/TodosContext'
import { useUser } from '../../services/context/UserContext'
import { fetchLatestLessonsSupabase } from '../../services/api/lessons.api'
import { fetchNotes } from '../../services/api/notes.api'
import { fetchStudents } from '../../services/api/students.api'
import { fetchTodosSupabase } from '../../services/api/todos.api'
import mockStudents from '../../services/api/mock-db/mockStudents'
import mockLessons from '../../services/api/mock-db/mockLessons'
import mockNotes from '../../services/api/mock-db/mockNotes'

interface MainProps {
  children: React.ReactNode
}

function Main({ children }: MainProps) {
  const { user } = useUser()
  const { closestStudentIndex } = useClosestStudent()
  const { setCurrentStudentIndex } = useStudents()
  const [isPending, setIsPending] = useState(true)
  const { setStudents } = useStudents()
  const { setLessons } = useLessons()
  const { setNotes } = useNotes()
  const { setTodos } = useTodos()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [errorMessage, setErrorMessage] = useState('')
  const mode = import.meta.env.VITE_MODE
  useEffect(() => {
    setCurrentStudentIndex(closestStudentIndex)
  }, [closestStudentIndex, setCurrentStudentIndex])

  useEffect(() => {
    if (mode === 'demo') {
      setStudents(mockStudents)
      setLessons(mockLessons)
      setNotes(mockNotes)
      setIsPending(false)
      return
    }

    if (user) {
      const allPromise = Promise.all([
        fetchStudents(user.id),
        fetchLatestLessonsSupabase(),
        fetchNotes(),
        fetchTodosSupabase(user.id),
      ])
      const fetchAll = async () => {
        setErrorMessage('')
        try {
          const [students, lessons, notes, todos] = await allPromise
          setStudents([...students])
          setLessons([...lessons])
          setNotes([...notes])
          setTodos([...todos])

          setIsPending(false)
        } catch (err) {
          setErrorMessage(
            'Etwas ist schiefgelaufen. Versuche, die Seite neu zu laden.',
          )
          setIsPending(false)
        }
      }
      fetchAll()
    }
  }, [setLessons, setNotes, setStudents, setTodos, user, mode])

  useEffect(() => {
    if (errorMessage)
      toast(errorMessage, {
        position: 'top-center',
        type: 'error',
        autoClose: false,
      })
  }, [errorMessage])

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
      {isPending && <Loader loading={isPending} />}
      {!isPending && !errorMessage && <div id="main">{children}</div>}
      {!isOnline && <OfflineBanner />}
    </>
  )
}

export default Main
