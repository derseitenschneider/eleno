import { RefObject, useEffect, useRef } from 'react'

export function useOutsideClick(handler: () => void, listenCapturing = true) {
  const ref: RefObject<any> = useRef(null)

  //RefObject<HTMLUListElement>

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
