import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Loader from '../../components/common/loader/Loader'
import OfflineBanner from '../../components/common/offlineBanner/OfflineBanner.component'
import { useClosestStudent } from '../../contexts/ClosestStudentContext'
import { useLessons } from '../../contexts/LessonsContext'
import { useNotes } from '../../contexts/NotesContext'
import { useStudents } from '../../contexts/StudentContext'
import { useTodos } from '../../contexts/TodosContext'
import { useUser } from '../../contexts/UserContext'
import { fetchLatestLessonsSupabase } from '../../services/lessons.api'
import { fetchNotes } from '../../services/notes.api'
import { fetchStudents } from '../../services/students.api'
import { fetchTodosSupabase } from '../../services/todos.api'
import mockStudents from '../../services/mock-db/mockStudents'
import mockLessons from '../../services/mock-db/mockLessons'
import mockNotes from '../../services/mock-db/mockNotes'

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
