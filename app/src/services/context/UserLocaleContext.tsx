import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

type TLocale = 'en' | 'de' | undefined
type UserLocaleContextType = {
  userLocale: TLocale
}
const UserLocaleContext = createContext<UserLocaleContextType>({
  userLocale: 'en',
})

export function UserLocaleProvider({
  children,
}: { children: React.ReactNode }) {
  const [userLocale, setUserLocale] = useState<TLocale>('en')

  useEffect(() => {
    if (navigator.languages.includes('de')) setUserLocale('de')
  }, [])

  return (
    <UserLocaleContext.Provider value={{ userLocale }}>
      {children}
    </UserLocaleContext.Provider>
  )
}

export const useUserLocale = () => useContext(UserLocaleContext)
