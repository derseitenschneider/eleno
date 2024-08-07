import { FormEventHandler, Fragment, useState } from 'react'

import { PDFDownloadLink } from '@react-pdf/renderer'

import type { TimetableDay } from '../../../types/types'
import TimetablePDF from '../pdf/TimetablePDF.component'
import { useUser } from '../../../services/context/UserContext'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ExportTimeTableProps {
  days: TimetableDay[]
}

function ExportTimetable({ days }: ExportTimeTableProps) {
  const { user } = useUser()
  const [selectedDays, setSelectedDays] = useState<TimetableDay[]>([])
  const [title, setTitle] = useState('')
  const daysWithStudents = days.filter((day) => day.lessonHolders.length > 0)

  const userName = `${user.firstName} ${user.lastName}`
  const userNameDashes = userName.split(' ').join('-').toLowerCase()

  const handleSelect = (e) => {
    console.log(e)
    const { value } = e.target

    if (selectedDays.find((day) => day.day === value)) {
      setSelectedDays((prev) => prev.filter((el) => el.day !== value))
    } else {
      const additionalDay = daysWithStudents.find((d) => d.day === value)
      if (additionalDay) setSelectedDays((prev) => [...prev, additionalDay])
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
    <div>
      <p>Exportiere den gesamten Stundenplan oder einzelne Tage.</p>
      <ul className='my-5'>
        <li className='mb-3'>
          <Checkbox
            name='all'
            id='all'
            onCheckedChange={handleSelectAll}
            checked={selectedDays.length === daysWithStudents.length}
          />
          <Label htmlFor='all' className='ml-2 text-sm'>
            Alle
          </Label>
        </li>
        {daysWithStudents.map((day) => (
          <li key={day.day}>
            <Checkbox
              name={day.day}
              id={day.day}
              onCheckedChange={handleSelect}
              value={day.day}
              checked={!!selectedDays.find((el) => el.day === day.day)}
            />
            <Label htmlFor={day.day} className='text-sm ml-2'>
              {day.day}
            </Label>
          </li>
        ))}
      </ul>
      <div className='export-timetable__title-input'>
        <Label htmlFor='title'>Titel (optional)</Label>
        <Input
          type='text'
          name='title'
          id='title'
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target
            setTitle(value)
          }}
        />
      </div>
      <div
        className={`export-timetable__buttons${selectedDays.length === 0 ? ' hidden' : ''
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
              ? title.split(' ').join('-').toLowerCase()
              : `stundenplan-${userNameDashes}`
          }
        >
          <Button variant='default' size='sm'>
            PDF herunterladen
          </Button>
        </PDFDownloadLink>
      </div>
    </div>
  )
}

export default ExportTimetable
