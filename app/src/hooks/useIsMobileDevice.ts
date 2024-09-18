import { useState, useEffect } from 'react'

const useIsMobileDevice = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const checkMobile = (): void => {
      const userAgent: string = navigator.userAgent || ''

      const mobileRegex: RegExp =
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i

      const mobileCheck: boolean = mobileRegex.test(userAgent)
      const smallScreen: boolean = window.innerWidth <= 768

      setIsMobile(mobileCheck || smallScreen)
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
