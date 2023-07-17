import { createContext, useContext, useState } from 'react'
import { ContextTypeUser, TProfile, TUser } from '../../../app/src/types/types'
// import {
//   deleteAccountSupabase,
//   getProfilesSupabase,
//   updateEmailSupabase,
//   updatePasswordSupabase,
//   updateProfileSupabase,
// } from '../supabase/users/users.supabase'
// import { supabase } from '../supabase/supabase'
// import { Session } from '@supabase/gotrue-js/src/lib/types'
// import LoginPage from '../pages/login/LoginPage'
// import { useLoading } from './LoadingContext'
// import fetchErrorToast from '../hooks/fetchErrorToast'

export const UserContext = createContext<ContextTypeUser>({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  updateProfile: () => new Promise(() => {}),
  updateEmail: () => new Promise(() => {}),
  updatePassword: () => new Promise(() => {}),
  deleteAccount: () => new Promise(() => {}),
})

const mockUser: TUser = {
  email: 'hans@muster.com',
  id: 'w3rjasfjooasdfjö',
  firstName: 'Hans',
  lastName: 'Demo',
}

export const AuthProvider = ({ children }) => {
  const [session] = useState(true)
  const [user, setUser] = useState<TUser>(mockUser)

  // const getUserProfiles = async (userId: string) => {
  //   try {
  //     const [data] = await getProfilesSupabase(userId)
  //     const user: TUser = {
  //       email: data.email,
  //       id: data.id,
  //       firstName: data.first_name,
  //       lastName: data.last_name,
  //     }
  //     setUser(user)
  //   } catch (error) {
  //     fetchErrorToast()
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session)
  //     if (session) {
  //       getUserProfiles(session.user.id)
  //     } else {
  //       setLoading(false)
  //     }
  //   })

  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session)
  //     if (session) {
  //       getUserProfiles(session.user.id)
  //     } else {
  //     }
  //   })
  // }, [])

  const updateProfile = (updatedUser: TUser) => {
    setUser((user) => ({
      ...user,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    }))
  }

  const updateEmail = async (email: string) => {
    setUser((user) => ({ ...user, email }))
  }

  const updatePassword = async (password: string) => {}

  const deleteAccount = async () => {}

  const value = {
    user,
    updateProfile,
    updateEmail,
    updatePassword,
    deleteAccount,
  }

  return (
    <UserContext.Provider value={value}>
      {session && children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
