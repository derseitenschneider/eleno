import { useEffect, useState } from 'react'

import Sidebar from './layouts/sidebar/Sidebar.component'
import { Outlet } from 'react-router-dom'
import { fetchLessons, fetchStudents } from './supabase/supabase'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
      />
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
