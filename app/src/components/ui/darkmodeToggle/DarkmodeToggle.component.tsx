import { useEffect, useState } from 'react'
import './darkmodeToggle.style.scss'

export default function DarkmodeToggle() {
  const [darkmode, setDarkmode] = useState(false)
  const toggleDarkMode = () => {
    setDarkmode((prev) => !prev)
  }

  useEffect(() => {
    if (darkmode) {
      document.documentElement.classList.add('dark-mode')
      document.documentElement.classList.remove('light-mode')
    } else {
      document.documentElement.classList.add('light-mode')
      document.documentElement.classList.remove('dark-mode')
    }
  }, [darkmode])

  return (
    <div className="toggle-darkmode">
      <label htmlFor="darkmode">
        Darkmode{' '}
        <input
          type="checkbox"
          name="darkmode"
          id="darkmode"
          onChange={toggleDarkMode}
          checked={darkmode}
        />
      </label>
    </div>
  )
}
