import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import {
  deleteLessonSupabase,
  saveNewLessonSupabase,
  updateLessonSupabase,
} from "../api/lessons.api"
import type { ContextTypeLessons, Draft, Lesson } from "../../types/types"
import { useUser } from "./UserContext"
import mockLessons from "../api/mock-db/mockLessons"

export const LessonsContext = createContext<ContextTypeLessons>({
  lessons: [],
  setLessons: () => {},

  lessonYears: [],
  setLessonYears: () => {},

  drafts: [],
  setDrafts: () => {},

  saveNewLesson: () => new Promise(() => {}),
  deleteLesson: () => new Promise(() => {}),
  updateLesson: () => new Promise(() => {}),
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
        const newLesson = await saveNewLessonSupabase(lesson, user?.id || "")
        if (newLesson) setLessons((prev) => [...prev, newLesson])
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message)
      }
    },
    [user?.id],
  )

  const deleteLesson = useCallback(async (lessonId: number) => {
    if (mode === "demo") {
      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId))
      return
    }
    try {
      await deleteLessonSupabase(lessonId)
      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId))
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
    }
  }, [])

  const updateLesson = useCallback(async (updatedLesson: Lesson) => {
    if (mode === "demo") {
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === updatedLesson.id
            ? {
                ...updatedLesson,
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
              }
            : lesson,
        ),
      )
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
    }
  }, [])

  const value = useMemo(
    () => ({
      lessons,
      setLessons,
      lessonYears,
      setLessonYears,

      drafts,
      setDrafts,
      saveNewLesson,
      deleteLesson,
      updateLesson,
    }),
    [
      lessons,
      lessonYears,
      // setLessons,

      drafts,
      // setDrafts,
      saveNewLesson,
      deleteLesson,
      updateLesson,
    ],
  )

  return (
    <LessonsContext.Provider value={value}>{children}</LessonsContext.Provider>
  )
}

export const useLessons = () => useContext(LessonsContext)
