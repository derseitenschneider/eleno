import { useEffect, useState } from 'react'

import Sidebar from './layouts/sidebar/Sidebar.component'
import { Outlet, redirect } from 'react-router-dom'

// SUPABASE
import { getProfiles } from './supabase/users/users.supabase'
import { fetchStudents } from './supabase/students/students.supabase'
import { fetchLessons } from './supabase/lessons/lessons.supabase'
import { fetchNotes } from './supabase/notes/notes.supabase'

import { supabase } from './supabase/supabase'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { TUser, TLesson, TStudent, TNotes } from './types/types'
import LoginPage from './pages/login/LoginPage'
import { Session } from '@supabase/gotrue-js/src/lib/types'
import Loader from './components/loader/Loader'

export default function Application() {
  const [loading, setLoading] = useState(false)

  // [ ] add closestCurrentStudent to context

  const [user, setUser] = useState<TUser>()
  const [students, setStudents] = useState<TStudent[] | null>([])
  const [lessons, setLessons] = useState<TLesson[] | null>([])
  const [notes, setNotes] = useState<TNotes[] | null>([])
  const [session, setSession] = useState<Session>()

  const getUserProfiles = async (userId: string) => {
    setLoading(true)
    const [data] = await getProfiles(userId)
    const user: TUser = {
      email: data.email,
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
    }
    setUser(user)
  }

  useEffect(() => {
    setLoading(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        getUserProfiles(session.user.id)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)

      if (session) {
        getUserProfiles(session.user.id)
      }
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
                user,
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
