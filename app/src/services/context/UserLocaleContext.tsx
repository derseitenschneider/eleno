import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type TLocale = "en" | "de" | undefined
type UserLocaleContextType = {
  userLocale: TLocale
}
const UserLocaleContext = createContext<UserLocaleContextType>({
  userLocale: "en",
})

export function UserLocaleProvider({
  children,
}: { children: React.ReactNode }) {
  const [userLocale, setUserLocale] = useState<TLocale>("en")

  useEffect(() => {
    const locale = navigator.language || navigator.language || "en"

    if (locale === "en" || locale === "de") {
      setUserLocale(locale)
    }
  }, [])

  return (
    <UserLocaleContext.Provider value={{ userLocale }}>
      {children}
    </UserLocaleContext.Provider>
  )
}

export const useUserLocale = () => useContext(UserLocaleContext)
