import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import { useLoading } from "@/services/context/LoadingContext"
import OfflineBanner from "./components/ui/offlineBanner/OfflineBanner.component"
import { fetchGroups } from "./services/api/groups.api"
import {
  fetchLatestLessonsSupabase,
  fetchLessonYearsSupabase,
} from "./services/api/lessons.api"
import mockLessons from "./services/api/mock-db/mockLessons"
import mockNotes from "./services/api/mock-db/mockNotes"
import mockStudents from "./services/api/mock-db/mockStudents"
import { fetchNotes } from "./services/api/notes.api"
import { fetchStudents } from "./services/api/students.api"
import { fetchTodosSupabase } from "./services/api/todos.api"
import { useNearestStudent } from "./services/context/NearestStudentContext"
import { useGroups } from "./services/context/GroupsContext"
import { useLessons } from "./services/context/LessonsContext"
import { useNotes } from "./services/context/NotesContext"
import { useStudents } from "./services/context/StudentContext"
import { useTodos } from "./services/context/TodosContext"
import { useUser } from "./services/context/UserContext"

interface DataFetcherProps {
  children: React.ReactNode
}

function DataFetcher({ children }: DataFetcherProps) {
  const { user } = useUser()
  const { nearestStudentIndex } = useNearestStudent()
  const { setCurrentStudentIndex } = useStudents()
  const { setIsLoading } = useLoading()

  const { setStudents } = useStudents()
  const { setLessons, setLessonYears } = useLessons()
  const { setNotes } = useNotes()
  const { setGroups } = useGroups()
  const { setTodos } = useTodos()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [errorMessage, setErrorMessage] = useState("")
  const _MODE = import.meta.env.VITE_MODE

  useEffect(() => {
    setCurrentStudentIndex(nearestStudentIndex)
  }, [nearestStudentIndex, setCurrentStudentIndex])

  useEffect(() => {
    if (_MODE === "demo") {
      setStudents(mockStudents)
      setLessons(mockLessons)
      setNotes(mockNotes)
      setIsLoading(false)
      return
    }

    if (user) {
      const allPromise = Promise.all([
        fetchStudents(user.id),
        fetchLatestLessonsSupabase(),
        fetchNotes(),
        fetchTodosSupabase(user.id),
        fetchGroups(),
        fetchLessonYearsSupabase(),
      ])
      const fetchAll = async () => {
        setErrorMessage("")
        try {
          const [students, lessons, notes, todos, groups, lessonYears] =
            await allPromise
          setStudents([...students])
          setLessons([...lessons])
          setNotes([...notes])
          setTodos([...todos])
          setGroups([...groups])
          setLessonYears([...lessonYears])
        } catch (err) {
          setErrorMessage(
            "Etwas ist schiefgelaufen. Versuche, die Seite neu zu laden.",
          )
        } finally {
          setIsLoading(false)
        }
      }
      fetchAll()
    }
  }, [
    setLessons,
    setNotes,
    setStudents,
    setTodos,
    user,
    setGroups,
    setIsLoading,
  ])

  useEffect(() => {
    if (errorMessage)
      toast(errorMessage, {
        position: "top-center",
        type: "error",
        autoClose: false,
      })
  }, [errorMessage])

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("online", handleStatusChange)
    window.addEventListener("offline", handleStatusChange)

    return () => {
      window.removeEventListener("online", handleStatusChange)
      window.removeEventListener("offline", handleStatusChange)
    }
  }, [])

  return (
    <>
      {!errorMessage && <div id='main'>{children}</div>}
      {!isOnline && _MODE !== "demo" && <OfflineBanner />}
    </>
  )
}

export default DataFetcher
