import type React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface FloatingWindowProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  initialPosition?: { x: number; y: number }
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({
  isOpen,
  onClose,
  title,
  children,
  initialPosition = { x: 100, y: 100 },
}) => {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  const constrainPosition = useCallback((x: number, y: number) => {
    if (!windowRef.current) return { x, y }
    const windowWidth = windowRef.current.offsetWidth
    const windowHeight = windowRef.current.offsetHeight
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    return {
      x: Math.min(Math.max(x, 0), viewportWidth - windowWidth),
      y: Math.min(Math.max(y, 0), viewportHeight - windowHeight),
    }
  }, [])

  const handleStart = (clientX: number, clientY: number) => {
    if (!windowRef.current) return
    const startX = clientX - position.x
    const startY = clientY - position.y

    const handleMove = (moveClientX: number, moveClientY: number) => {
      const newPosition = constrainPosition(
        moveClientX - startX,
        moveClientY - startY,
      )
      setPosition(newPosition)
    }

    const handleEnd = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

    const handleMouseUp = handleEnd
    const handleTouchEnd = handleEnd

    setIsDragging(true)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleStart(e.clientX, e.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  useEffect(() => {
    const handleResize = () => {
      setPosition((prevPosition) =>
        constrainPosition(prevPosition.x, prevPosition.y),
      )
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [constrainPosition])

  if (!isOpen) return null

  const floatingWindow = (
    <div
      ref={windowRef}
      className={`fixed bg-background100 rounded-lg shadow-lg overflow-hidden border border-hairline transition-shadow ${isDragging ? 'shadow-xl' : ''
        }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        minWidth: '200px',
      }}
    >
      <div
        className='flex justify-between items-center bg-background50 py-2 px-4 cursor-move'
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <h5 className='text-foreground text-sm font-medium'>{title}</h5>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full w-6 h-6 p-0 hover:bg-background200'
          onClick={onClose}
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
      <div className='p-4 bg-background50/40 text-foreground'>{children}</div>
    </div>
  )

  return createPortal(floatingWindow, document.body)
}

export default FloatingWindow
