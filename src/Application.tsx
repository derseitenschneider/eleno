import { useEffect, useState } from 'react'
import { Outlet, redirect } from 'react-router-dom'

// Supabase
import { supabase } from './supabase/supabase'
import { getProfiles } from './supabase/users/users.supabase'
import { fetchStudents } from './supabase/students/students.supabase'
import { fetchLessons } from './supabase/lessons/lessons.supabase'
import { fetchNotes } from './supabase/notes/notes.supabase'
import { Session } from '@supabase/gotrue-js/src/lib/types'

// Toast
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Types
import { TUser, TLesson, TStudent, TNotes } from './types/types'

// Pages
import LoginPage from './pages/login/LoginPage'

// Components
import Sidebar from './layouts/sidebar/Sidebar.component'
import Loader from './components/loader/Loader'

// Functions
import { getClosestStudentIndex } from './utils/getClosestStudentIndex'

export default function Application() {
  const [loading, setLoading] = useState(false)

  // [ ] add closestCurrentStudent to context

  const [user, setUser] = useState<TUser | null>(null)
  const [students, setStudents] = useState<TStudent[] | null>([])
  const [lessons, setLessons] = useState<TLesson[] | null>([])
  const [notes, setNotes] = useState<TNotes[] | null>([])
  const [session, setSession] = useState<Session>()

  const [closestStudentIndex, setClosestStudentIndex] = useState(0)

  const getUserProfiles = async (userId: string) => {
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
    if (user) {
      Promise.all([
        fetchStudents(user.id),
        fetchLessons(user.id),
        fetchNotes(user.id),
      ]).then(([students, lessons, notes]) => {
        setStudents([...students])
        setLessons([...lessons])
        setNotes([...notes])
        setLoading(false)
      })
    }
  }, [user])

  useEffect(() => {
    if (students) {
      setClosestStudentIndex(getClosestStudentIndex(students))
    }
  }, [students])

  return (
    <>
      <Loader loading={loading} />

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
        {!loading && session ? (
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
                  setLoading,
                  closestStudentIndex,
                }}
              />
            </div>
          </>
        ) : (
          <LoginPage />
        )}
      </div>
    </>
  )
}
