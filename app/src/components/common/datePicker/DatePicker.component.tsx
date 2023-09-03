import { FC, useState } from 'react'
import './datePicker.style.scss'
import 'react-day-picker/dist/style.css'
import { DayPicker } from 'react-day-picker'
import { de } from 'date-fns/locale'
import { IoCalendarClearOutline, IoCloseOutline } from 'react-icons/io5'
import { useOutsideClick } from '../../../hooks/useOutsideClick'

interface DatePickerProps {
  display?: 'left' | 'right'
  selectedDate?: Date
  setDate: React.Dispatch<React.SetStateAction<string>>
}

const DatePicker: FC<DatePickerProps> = ({
  display = 'left',
  setDate,
  selectedDate,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const toggleCalendar = () => {
    setCalendarOpen((prev) => !prev)
  }
  const ref = useOutsideClick(() => setCalendarOpen(false))

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
    setDate('')
  }

  return (
    <div className="date-picker">
      {selectedDate ? (
        <div className="date-picker__wrapper-date">
          <span
            className="date-picker__date"
            onClick={() => setCalendarOpen(true)}
          >
            {selectedDate
              .toLocaleDateString()
              .split('.')
              .map((el, i) =>
                i === 0 || i === 1 ? el.padStart(2, '0') : el.slice(2)
              )
              .join('.')}
          </span>
          <button
            className="date-picker__btn-remove btn-remove"
            onClick={resetDate}
          >
            <IoCloseOutline />
          </button>
        </div>
      ) : (
        <button className="date-picker__btn-open" onClick={toggleCalendar}>
          <IoCalendarClearOutline />
        </button>
      )}
      {calendarOpen && (
        <div
          className="date-picker__calendar"
          ref={ref}
          style={
            display === 'left'
              ? {
                  right: '0',
                }
              : { left: '0' }
          }
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            locale={de}
          />
        </div>
      )}
    </div>
  )
}

export default DatePicker
