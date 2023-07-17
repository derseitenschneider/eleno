import { FunctionComponent, useEffect, useState } from 'react'

import { useStudents } from '../contexts/StudentContext'
// import { useStudents } from '../../contexts/StudentContext'

// import { useLessons } from '../../contexts/LessonsContext'

// import { useNotes } from '../../contexts/NotesContext'

// import { useTodos } from '../../contexts/TodosContext'
// import Loader from '../../components/common/loader/Loader'
// import { useUser } from '../../contexts/UserContext'
import OfflineBanner from '../../../app/src/components/common/offlineBanner/OfflineBanner.component'
// import OfflineBanner from '../../components/common/offlineBanner/OfflineBanner.component'
// import { toast } from 'react-toastify'
import { useClosestStudent } from '../contexts/ClosestStudentContext'

interface MainProps {
  children: React.ReactNode
}

const Main: FunctionComponent<MainProps> = ({ children }) => {
  // const { user } = useUser()
  const { closestStudentIndex } = useClosestStudent()
  const { setStudentIndex } = useStudents()
  // const [isPending, setIsPending] = useState(true)
  // const { setStudents, students } = useStudents()
  // const { setLessons } = useLessons()
  // const { setNotes, notes } = useNotes()
  // const { setTodos } = useTodos()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  // const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setStudentIndex(closestStudentIndex)
  }, [closestStudentIndex])

  // useEffect(() => {
  //   if (user) {
  //     const allPromise = Promise.all([
  //       fetchStudents(user.id),
  //       fetchLatestLessonsSupabase(),
  //       fetchNotes(),
  //       fetchTodosSupabase(user.id),
  //     ])
  //     const fetchAll = async () => {
  //       setErrorMessage('')
  //       try {
  //         const [students, lessons, notes, todos] = await allPromise
  //         setStudents([...students])
  //         setLessons([...lessons])
  //         setNotes([...notes])
  //         setTodos([...todos])

  //         setIsPending(false)
  //       } catch (err) {
  //         setErrorMessage(
  //           'Etwas ist schiefgelaufen. Versuche, die Seite neu zu laden.'
  //         )
  //         setIsPending(false)
  //       }
  //     }
  //     fetchAll()
  //   }
  // }, [user])

  // useEffect(() => {
  //   if (errorMessage)
  //     toast(errorMessage, {
  //       position: 'top-center',
  //       type: 'error',
  //       autoClose: false,
  //     })
  // }, [errorMessage])

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
      <div id="main">{children}</div>
      {!isOnline && <OfflineBanner />}
    </>
  )
}

export default Main
