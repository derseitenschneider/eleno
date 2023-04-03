import { createContext, useState, useEffect } from 'react'
import { ContextTypeUser, TUser } from '../types/types'
import { getProfiles } from '../supabase/users/users.supabase'
import { supabase } from '../supabase/supabase'
import { Session } from '@supabase/gotrue-js/src/lib/types'
import LoginPage from '../pages/login/LoginPage'
import Loader from '../components/loader/Loader'
import { useLoading } from '../hooks/useLoading'

export const UserContext = createContext<ContextTypeUser>({
  user: null,
  setUser: () => {},
})

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState<Session>()
  const [user, setUser] = useState<TUser | null>(null)
  const { loading, setLoading } = useLoading()

  const getUserProfiles = async (userId: string) => {
    const [data] = await getProfiles(userId)
    const user: TUser = {
      email: data.email,
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
    }
    setUser(user)
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        getUserProfiles(session.user.id)
      } else {
        setLoading(false)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      // setLoading(true)
      setSession(session)
      if (session) {
        getUserProfiles(session.user.id)
      } else {
        // setLoading(false)
      }
    })
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {session && children}
      {!session && !loading && <LoginPage />}
    </UserContext.Provider>
  )
}
