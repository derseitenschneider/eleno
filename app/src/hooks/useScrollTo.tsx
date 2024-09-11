import { useEffect } from 'react'

export default function useScrollTo(x = 0, y = 0) {
  return () => {
    useEffect(() => {
      window.scrollTo(x, y)
    }, [x, y])
  }
}
