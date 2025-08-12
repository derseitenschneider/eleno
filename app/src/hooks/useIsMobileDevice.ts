import { useEffect, useState } from 'react'

const useIsMobileDevice = (): boolean => {
  const checkIsMobile = (): boolean => {
    const width = window.innerWidth
    
    // Check if device has touch capabilities
    const hasTouch = 'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0 ||
                     (navigator as any).msMaxTouchPoints > 0
    
    // Check user agent for mobile/tablet devices
    const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    
    // Very narrow width - definitely mobile
    if (width < 480) return true
    
    // Has touch capabilities and mobile-like width
    if (hasTouch && width < 768) return true
    
    // Mobile user agent with reasonable width for tablets
    if (mobileUserAgent && width < 1024) return true
    
    // Otherwise it's desktop
    return false
  }

  const [isMobile, setIsMobile] = useState<boolean>(checkIsMobile())

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(checkIsMobile())
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}

export default useIsMobileDevice
