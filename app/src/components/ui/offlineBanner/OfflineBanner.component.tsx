import { useEffect, useState } from "react"
import "./offlineBanner.style.scss"

function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener("online", handleStatusChange)
    window.addEventListener("offline", handleStatusChange)

    return () => {
      window.removeEventListener("online", handleStatusChange)
      window.removeEventListener("offline", handleStatusChange)
    }
  }, [])

  if (isOnline) return null
  return (
    <div className='offline-banner'>
      Du bist momentan offline. Damit die App richtig funktioniert, benötigst du
      eine Internetverbindung!
    </div>
  )
}

export default OfflineBanner
