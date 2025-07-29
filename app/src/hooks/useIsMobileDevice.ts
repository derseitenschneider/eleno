import { useState, useEffect } from 'react'

const useIsMobileDevice = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(
    window.innerWidth <= 768 || window.innerHeight <= 768,
  )

  useEffect(() => {
    const checkMobile = (): void => {
      const mobile = window.innerWidth < 768 || window.innerHeight < 768
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return isMobile
}

export default useIsMobileDevice
