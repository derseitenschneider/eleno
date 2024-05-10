import { useState } from "react"

import { PDFDownloadLink } from "@react-pdf/renderer"

import type { TimetableDay } from "../../../../types/types"
import "./exportTimetable.style.scss"
import Button from "../../../ui/button/Button.component"
import TimetablePDF from "../../pdf/TimetablePDF.component"
import { useUser } from "../../../../services/context/UserContext"

interface ExportTimeTableProps {
  days: TimetableDay[]
}

function ExportTimetable({ days }: ExportTimeTableProps) {
  const { user } = useUser()
  const [selectedDays, setSelectedDays] = useState<TimetableDay[]>([])
  const [title, setTitle] = useState("")
  const daysWithStudents = days.filter((day) => day.students.length > 0)

  const userName = `${user.firstName} ${user.lastName}`
  const userNameDashes = userName.split(" ").join("-").toLowerCase()

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (selectedDays.find((day) => day.day === value)) {
      setSelectedDays((prev) => prev.filter((el) => el.day !== value))
    } else {
      const additionalDay = daysWithStudents.find((d) => d.day === value)
      setSelectedDays((prev) => [...prev, additionalDay])
    }
  }

  const handleSelectAll = () => {
    if (selectedDays.length === daysWithStudents.length) {
      setSelectedDays([])
    } else {
      setSelectedDays(daysWithStudents)
    }
  }

  return (
    <div className='export-timetable'>
      <h2 className='heading-2'>Stundenplan exportieren</h2>
      <p>Exportiere einzelne Tage oder den gesamten Stundenplan.</p>
      <div className='export-timetable__checkboxes'>
        {daysWithStudents.map((day) => (
          <label htmlFor={day.day} key={day.day}>
            <input
              type='checkbox'
              name={day.day}
              id={day.day}
              onChange={handleSelect}
              value={day.day}
              checked={!!selectedDays.find((el) => el.day === day.day)}
            />
            {day.day}
          </label>
        ))}
        <label htmlFor='all'>
          <input
            type='checkbox'
            name='all'
            id='all'
            onChange={handleSelectAll}
            checked={selectedDays.length === daysWithStudents.length}
          />{" "}
          Alle
        </label>
      </div>
      <div className='export-timetable__title-input'>
        <label htmlFor='title'>
          Titel (optional)
          <input
            type='text'
            name='title'
            id='title'
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target
              setTitle(value)
            }}
          />
        </label>
      </div>
      <div
        className={`export-timetable__buttons${
          selectedDays.length === 0 ? " hidden" : ""
        }`}
      >
        <PDFDownloadLink
          document={
            <TimetablePDF
              days={selectedDays}
              title={title}
              userName={userName}
            />
          }
          fileName={
            title
              ? title.split(" ").join("-").toLowerCase()
              : `stundenplan-${userNameDashes}`
          }
        >
          <Button type='button' btnStyle='primary'>
            PDF herunterladen
          </Button>
        </PDFDownloadLink>
      </div>
    </div>
  )
}

export default ExportTimetable
