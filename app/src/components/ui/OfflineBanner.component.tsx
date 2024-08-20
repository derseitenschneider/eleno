import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

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
  return createPortal(
    <div className='opacity-8 fixed text-4 text-center bottom-0 left-0 w-full bg-warning p-2 z-10000 text-white'>
      Du bist momentan offline. Damit die App richtig funktioniert, benötigst du
      eine Internetverbindung!
    </div>,
    document.body,
  )
}

export default OfflineBanner
