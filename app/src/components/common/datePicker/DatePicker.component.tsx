import { de } from 'date-fns/locale'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { createPortal } from 'react-dom'
import { IoCalendarOutline, IoCloseOutline } from 'react-icons/io5'
import './datePicker.style.scss'

interface DatePickerProps {
  selectedDate?: Date
  setDate: React.Dispatch<React.SetStateAction<string | null>>
  id: string
  hideRemoveBtn?: boolean
}

function DatePicker({
  setDate,
  selectedDate,
  id = '',
  hideRemoveBtn,
}: DatePickerProps) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const calendarRef: MutableRefObject<HTMLDivElement> = useRef()

  const thisYear = new Date().getFullYear()
  const toggleRef = useRef()

  const getPosition = () => {
    const pickerElement = toggleRef.current as Element

    const rect = pickerElement?.getBoundingClientRect()
    if (rect) {
      const calendarWidth = 308
      const calendarHeight = 308

      let posX: number
      let posY: number
      const distanceToLeft = rect.x
      const distanceToBottom = window.innerHeight - rect.y

      if (window.innerWidth < 680) {
        posX = (window.innerWidth - calendarWidth) / 2
      }

      if (distanceToLeft > calendarWidth + 20 && window.innerWidth > 680) {
        posX = rect.x - calendarWidth + rect.width / 2
      }
      if (distanceToLeft < calendarWidth + 20 && window.innerWidth > 680) {
        posX = rect.x + rect.width / 2
      }

      if (distanceToBottom > calendarHeight) {
        posY = rect.y + rect.height
      } else {
        posY = rect.y - calendarHeight
      }

      setPosition({
        x: posX,
        y: posY,
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      getPosition()
    }
    if (calendarOpen) {
      window.addEventListener('scroll', handleScroll, true)
    }
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [calendarOpen])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element

      if (
        calendarRef.current &&
        !calendarRef.current.contains(target) &&
        target?.closest('button')?.id !== id
      ) {
        setCalendarOpen(false)
      }
    }
    if (calendarOpen) {
      window.addEventListener('click', handleClick, true)
    }
    return () => window.addEventListener('click', handleClick, true)
  }, [calendarRef, calendarOpen, id])

  const toggleCalendar = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation()
    if (!calendarOpen) getPosition()

    setCalendarOpen((prev) => !prev)
  }

  const handleSelect = (e: Date) => {
    const dateString = e
      .toLocaleDateString()
      .split('.')
      .map((el, i) => (i === 0 || i === 1 ? el.padStart(2, '0') : el))
      .reverse()
      .join('-')
    setDate(dateString)
    setCalendarOpen(false)
  }

  const resetDate = () => {
    setDate(null)
  }

  return (
    <div className="date-picker">
      {selectedDate ? (
        <div className="date-picker__wrapper-date" ref={toggleRef}>
          <button
            type="button"
            className="date-picker__date"
            onClick={toggleCalendar}
          >
            {selectedDate
              .toLocaleDateString()
              .split('.')
              .map((el, i) =>
                i === 0 || i === 1 ? el.padStart(2, '0') : el.slice(2),
              )
              .join('.')}
          </button>
          {!hideRemoveBtn && (
            <button
              type="button"
              className="date-picker__btn-remove btn-remove"
              onClick={resetDate}
            >
              <IoCloseOutline />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          className="date-picker__btn-open"
          onClick={toggleCalendar}
          ref={toggleRef}
          id={id}
        >
          <IoCalendarOutline />
        </button>
      )}
      {calendarOpen &&
        createPortal(
          <div
            id={id}
            ref={calendarRef}
            className="date-picker__calendar"
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              defaultMonth={selectedDate}
              locale={de}
              captionLayout="dropdown-buttons"
              fromYear={thisYear - 10}
              toYear={thisYear + 2}
            />
          </div>,
          document.body,
        )}
    </div>
  )
}

export default DatePicker
