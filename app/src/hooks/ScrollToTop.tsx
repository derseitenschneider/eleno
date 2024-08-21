import { useEffect } from 'react'

function ScrollToTop({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return children
}

export default ScrollToTop
