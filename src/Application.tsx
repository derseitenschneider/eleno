import { useEffect, useState } from 'react'

import Sidebar from './layouts/sidebar/Sidebar.component'
import { Outlet } from 'react-router-dom'
import { fetchLessons, fetchStudents } from './supabase/supabase'

import { TLesson, TStudent } from './types/types'

export default function Application() {
  const [students, setStudents] = useState<TStudent[] | null>([])
  const [lessons, setLessons] = useState<TLesson[] | null>([])
  const [loading, setLoading] = useState<boolean>()

  useEffect(() => {
    setLoading(true)

    Promise.all([fetchStudents(), fetchLessons()]).then(
      ([students, lessons]) => {
        setStudents([...students])
        setLessons([...lessons])
        setLoading(false)
      }
    )
  }, [])

  return (
    <div className="App">
      <Sidebar />
      <div id="main">
        <Outlet
          context={{ students, setStudents, lessons, setLessons, loading }}
        />
      </div>
    </div>
  )
}

// export function useStudents() {
//   return useOutletContext<ContextType>();
// }
