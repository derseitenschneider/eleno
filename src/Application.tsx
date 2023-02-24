import { useEffect, useState } from 'react'

import Sidebar from './layouts/sidebar/Sidebar.component'
import { Outlet } from 'react-router-dom'
import { fetchLessons, fetchStudents } from './supabase/supabase'

import { TLesson, TStudent } from './types/types'

export default function Application() {
  const [students, setStudents] = useState<TStudent[] | null>([])
  const [lessons, setLessons] = useState<TLesson[] | null>([])

  useEffect(() => {
    const fetchAllData = async () => {
      const fetchStudentData = async () => {
        const students = await fetchStudents()
        setStudents([...students])
      }

      const fetchLessonData = async () => {
        const lessons = await fetchLessons()
        setLessons([...lessons])
      }
      Promise.all([fetchStudentData(), fetchLessonData()])
    }

    fetchAllData()
  }, [])

  return (
    <div className="App">
      <Sidebar />
      <div id="main">
        <Outlet context={{ students, setStudents, lessons, setLessons }} />
      </div>
    </div>
  )
}

// export function useStudents() {
//   return useOutletContext<ContextType>();
// }
