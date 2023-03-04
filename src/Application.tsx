import { useEffect, useState } from 'react'

import Sidebar from './layouts/sidebar/Sidebar.component'
import { Outlet } from 'react-router-dom'
import { fetchLessons, fetchStudents, fetchNotes } from './supabase/supabase'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { TLesson, TStudent, TNotes } from './types/types'

export default function Application() {
  const [loading, setLoading] = useState<boolean>()

  const [students, setStudents] = useState<TStudent[] | null>([])
  const [lessons, setLessons] = useState<TLesson[] | null>([])
  const [notes, setNotes] = useState<TNotes[] | null>([])

  useEffect(() => {
    setLoading(true)

    Promise.all([fetchStudents(), fetchLessons(), fetchNotes()]).then(
      ([students, lessons, notes]) => {
        setStudents([...students])
        setLessons([...lessons])
        setNotes([...notes])
        setLoading(false)
      }
    )
  }, [])

  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
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
          context={{
            students,
            setStudents,
            lessons,
            setLessons,
            notes,
            setNotes,
            loading,
          }}
        />
      </div>
    </div>
  )
}
