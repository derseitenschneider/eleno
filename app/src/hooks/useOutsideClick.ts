import { useEffect, useRef } from 'react'

export function useOutsideClick(handler, listenCapturing = true) {
  const ref: React.MutableRefObject<HTMLObjectElement> = useRef()

  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        const target = e.target as Element
        if (ref.current && !ref.current.contains(target)) {
          handler()
        }
      }

      document.addEventListener('click', handleClick, listenCapturing)

      return () =>
        document.removeEventListener('click', handleClick, listenCapturing)
    },
    [handler, listenCapturing]
  )

  return ref
}
