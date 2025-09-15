import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import useIsOnline from './useIsOnline'

export function useOfflineToast() {
  const isOnline = useIsOnline()
  const toastId = useRef<string | number | undefined>()

  useEffect(() => {
    if (!isOnline && !toastId.current) {
      // Show persistent offline toast
      toastId.current = toast('Du bist momentan offline', {
        description: 'Die Funktionsweise ist eingeschränkt, bis du wieder online bist.',
        duration: Number.POSITIVE_INFINITY,
        important: true,
      })
    } else if (isOnline && toastId.current) {
      // Dismiss offline toast when back online
      toast.dismiss(toastId.current)
      toastId.current = undefined

      // Optional: Show a brief "back online" confirmation
      toast.success('Wieder online', {
        description: 'Verbindung wiederhergestellt.',
        duration: 2000,
      })
    }
  }, [isOnline])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (toastId.current) {
        toast.dismiss(toastId.current)
      }
    }
  }, [])
}