import { useEffect, useState } from "react"
import { Droppable, type DroppableProps } from "@hello-pangea/dnd"

export default function StrictModeDroppable({
  children,
  ...props
}: DroppableProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const animation = setTimeout(() => setEnabled(true), 200)

    return () => {
      // cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) {
    return null
  }

  return <Droppable {...props}>{children}</Droppable>
}
