import { createContext, useContext, useEffect, useMemo } from 'react'
import useLocalStorageState from '../../hooks/useLocalStorageState'

type TDarkModeContext = {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<TDarkModeContext>({
  isDarkMode: false,
  toggleDarkMode: () => { },
})

function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    window.matchMedia('(prefers-color-scheme:dark)').matches,
    'isDarkMode',
  )

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode')
      document.documentElement.classList.remove('light-mode')
    } else {
      document.documentElement.classList.add('light-mode')
      document.documentElement.classList.remove('dark-mode')
    }

    // updateManifest(isDarkMode)
    // updateThemeColor(isDarkMode)
  }, [isDarkMode])

  const value = useMemo(
    () => ({
      isDarkMode,
      toggleDarkMode() {
        setIsDarkMode((prev) => !prev)
      },
    }),
    [isDarkMode, setIsDarkMode],
  )

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  )
}

function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined)
    throw new Error('DarkModeContext was used outside of DarkModeProvider')
  return context
}

export { DarkModeProvider, useDarkMode }
