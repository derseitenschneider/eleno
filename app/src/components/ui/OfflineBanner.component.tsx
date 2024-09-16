import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', handleStatusChange)
    window.addEventListener('offline', handleStatusChange)

    return () => {
      window.removeEventListener('online', handleStatusChange)
      window.removeEventListener('offline', handleStatusChange)
    }
  }, [])

  if (isOnline) return null
  return createPortal(
    <div className='opacity-75 fixed  text-4 text-center top-0 left-0 w-full bg-warning p-1 z-50 text-white'>
      Du bist momentan offline.
    </div>,
    document.body,
  )
}

export default OfflineBanner
