import { useState } from 'react'

import { PDFDownloadLink } from '@react-pdf/renderer'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import sortTimeTableDays from '@/utils/sortTimetableDays'
import type { TimetableDay } from '../../../types/types'
import TimetablePDF from '../pdf/TimetablePDF.component'
import useProfileQuery from '../user/profileQuery'

interface ExportTimeTableProps {
  days: TimetableDay[]
}

function ExportTimetable({ days }: ExportTimeTableProps) {
  const { data: userProfile } = useProfileQuery()
  const [selectedDays, setSelectedDays] = useState<TimetableDay[]>([])
  const [title, setTitle] = useState('')

  const daysWithStudents = days.filter((day) => day.lessonHolders.length > 0)
  const selectedDaysSorted = sortTimeTableDays(selectedDays)

  const userName = `${userProfile?.first_name} ${userProfile?.last_name}`
  const userNameDashes = userName.split(' ').join('-').toLowerCase()

  const handleSelect = (day: TimetableDay) => {
    const value = day.day

    if (selectedDays.find((day) => day.day === value)) {
      setSelectedDays((prev) => prev.filter((el) => el.day !== value))
    } else {
      setSelectedDays((prev) => [...prev, day])
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
      <DialogDescription>
        Exportiere den gesamten Stundenplan oder einzelne Tage.
      </DialogDescription>
      <ul className='my-5'>
        <li className='mb-3 flex items-center'>
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
          <li key={day.day} className='mb-1 flex items-center'>
            <Checkbox
              name={day.day || 'Kein Tag angegeben'}
              id={day.day || 'Kein Tag angegeben'}
              onCheckedChange={() => handleSelect(day)}
              value={day.day || ''}
              checked={!!selectedDays.find((el) => el.day === day.day)}
            />
            <Label
              htmlFor={day.day || 'Kein Tag angegeben'}
              className='ml-2 text-sm'
            >
              {day.day || 'Kein Tag angegeben'}
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
      <div className='flex justify-end'>
        <PDFDownloadLink
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            if (selectedDays.length === 0) {
              e.preventDefault()
            }
          }}
          document={
            <TimetablePDF
              days={selectedDaysSorted}
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
          <Button
            variant='default'
            className='mt-4'
            size='sm'
            disabled={selectedDays.length === 0}
          >
            PDF herunterladen
          </Button>
        </PDFDownloadLink>
      </div>
    </div>
  )
}

export default ExportTimetable
