import { RefObject, useEffect, useRef } from 'react'

function useOutsideClick<T extends HTMLElement>(
  handler: () => void,
  listenCapturing = true,
) {
  const ref: RefObject<T> = useRef(null)

  // RefObject<HTMLUListElement>

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Element
      if (ref.current && !ref.current.contains(target)) {
        handler()
      }
    }

    document.addEventListener('click', handleClick, listenCapturing)

    return () =>
      document.removeEventListener('click', handleClick, listenCapturing)
  }, [handler, listenCapturing])

  return ref
}
export default useOutsideClick
