import { useEffect, useState } from 'react'

import Sidebar from './layouts/sidebar/Sidebar.component'
import { Outlet } from 'react-router-dom'
import { fetchLessons, fetchStudents, fetchNotes } from './supabase/supabase'

import { Auth } from '@supabase/auth-ui-react'

import { ThemeSupa } from '@supabase/auth-ui-shared'

import { supabase } from './supabase/supabase'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { TLesson, TStudent, TNotes } from './types/types'
import LoginPage from './pages/login/LoginPage'
import { Session } from '@supabase/gotrue-js/src/lib/types'

export default function Application() {
  const [loading, setLoading] = useState<boolean>()

  // [ ] add closestCurrentStudent to context

  const [students, setStudents] = useState<TStudent[] | null>([])
  const [lessons, setLessons] = useState<TLesson[] | null>([])
  const [notes, setNotes] = useState<TNotes[] | null>([])
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [session, setSession] = useState<Session>()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // [ ] fetch only previous 3 lesson
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
      {session ? (
        <>
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
        </>
      ) : (
        <LoginPage />
      )}
    </div>
  )
}
