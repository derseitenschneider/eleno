import { createContext, useContext, useEffect, useState } from 'react'

export type TLocale = 'en' | 'de'
type UserLocaleContextType = {
  userLocale: TLocale
  setUserLocale: (locale: TLocale) => void
}

const UserLocaleContext = createContext<UserLocaleContextType>({
  userLocale: 'en',
  setUserLocale: () => { },
})

export function UserLocaleProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [userLocale, setUserLocale] = useState<TLocale>('en')

  useEffect(() => {
    const detectLocale = () => {
      const languages = [navigator.language, ...(navigator.languages || [])]

      // Check for German first
      if (languages.some((lang) => lang.startsWith('de'))) {
        setUserLocale('de')
      } else if (languages.some((lang) => lang.startsWith('en'))) {
        setUserLocale('en')
      }
      // If neither German nor English is found, it will default to 'en' as set in the initial state
    }

    detectLocale()
  }, [])

  return (
    <UserLocaleContext.Provider value={{ userLocale, setUserLocale }}>
      {children}
    </UserLocaleContext.Provider>
  )
}

export const useUserLocale = () => useContext(UserLocaleContext)
