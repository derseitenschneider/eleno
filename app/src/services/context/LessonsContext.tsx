import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import {
  deleteLessonSupabase,
  fetchAllLessonsSupabase,
  saveNewLessonSupabase,
  updateLessonSupabase,
} from "../api/lessons.api"
import type { ContextTypeLessons, Draft, Lesson } from "../../types/types"
import { formatDateToDatabase } from "../../utils/formateDate"
import { useUser } from "./UserContext"
import mockLessons from "../api/mock-db/mockLessons"

export const LessonsContext = createContext<ContextTypeLessons>({
  lessons: [],

  lessonYears: [],
  drafts: [],
  setDrafts: () => { },
  setLessons: () => { },

  saveNewLesson: () => new Promise(() => { }),
  deleteLesson: () => new Promise(() => { }),
  updateLesson: () => new Promise(() => { }),
  getAllLessons: () => new Promise(() => { }),
})

export function LessonsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [lessonYears, setLessonYears] = useState<Array<{ year: number }>>([])

  const [drafts, setDrafts] = useState<Draft[]>([])
  const mode = import.meta.env.VITE_MODE

  const saveNewLesson = useCallback(
    async (lesson: Lesson): Promise<void> => {
      const tempLesson: Lesson = {
        ...lesson,
      }

      if (mode === "demo") {
        setLessons((prev) => [...prev, tempLesson])
        return
      }

      try {
        const [data] = await saveNewLessonSupabase(tempLesson, user?.id)
        setLessons((prev) => [...prev, data])
      } catch (error) {
        throw new Error(error)
      }
    },
    [user?.id],
  )

  const deleteLesson = useCallback(
    async (lessonId: number) => {
      if (mode === "demo") {
        setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId))
        return
      }
      try {
        await deleteLessonSupabase(lessonId)
        setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId))
      } catch (err) {
        throw new Error(err)
      }
    },
    [mode],
  )

  const updateLesson = useCallback(
    async (updatedLesson: Lesson) => {
      if (mode === "demo") {
        setLessons((prev) =>
          prev.map((lesson) =>
            lesson.id === updatedLesson.id
              ? {
                ...updatedLesson,
                date: formatDateToDatabase(updatedLesson.date),
              }
              : lesson,
          ),
        )
      }
      try {
        const newLesson = await updateLessonSupabase(updatedLesson)
        setLessons((prev) =>
          prev.map((lesson) =>
            lesson.id === newLesson.id
              ? {
                ...newLesson,
                date: formatDateToDatabase(newLesson.date),
              }
              : lesson,
          ),
        )
      } catch (error) {
        throw new Error(error)
      }
    },
    [mode],
  )

  const getAllLessons = useCallback(
    async (studentId: number) => {
      if (mode === "demo") {
        return mockLessons.reverse()
      }
      try {
        const allLessons = await fetchAllLessonsSupabase(studentId)
        // setLessons(allLessons)
        return allLessons
      } catch (error) {
        throw new Error(error.mesage)
      }
    },
    [mode],
  )

  const value = useMemo(
    () => ({
      lessons,
      setLessons,

      drafts,
      setDrafts,
      saveNewLesson,
      deleteLesson,
      updateLesson,
      getAllLessons,
    }),
    [
      lessons,
      setLessons,

      drafts,
      setDrafts,
      saveNewLesson,
      deleteLesson,
      updateLesson,
      getAllLessons,
    ],
  )

  return (
    <LessonsContext.Provider value={value}>{children}</LessonsContext.Provider>
  )
}

export const useLessons = () => useContext(LessonsContext)
