import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CSVLink } from 'react-csv'

import type { Student } from '../../../types/types'

import { useUser } from '../../../services/context/UserContext'
import StudentListPDF from '../pdf/StudentlistPDF.component'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DialogDescription } from '@/components/ui/dialog'

interface ExportStudentListProps {
  students: Student[]
}

function ExportStudentList({ students }: ExportStudentListProps) {
  const [title, setTitle] = useState('')
  const { user } = useUser()

  const userName = `${user?.first_name} ${user?.last_name}`

  const studentsCSV = students.map((student, index) => ({
    index: index + 1,
    firstName: student.firstName,
    lastName: student.lastName,
    instrument: student.instrument,
    dayOfLesson: student.dayOfLesson ?? '–',
    startOfLesson: student.startOfLesson?.substring(0, 5) ?? '–',
    endOfLesson: student.endOfLesson?.substring(0, 5) ?? '–',
    durationMinutes: student.durationMinutes ?? '–',
    location: student.location ?? '–',
  }))

  const userNameDashes = userName.toLowerCase().split(' ').join('-')

  return (
    <div className='space-y-8'>
      <DialogDescription>
        Exportiere eine Liste mit allen aktiven Schüler:innen.
      </DialogDescription>
      <div>
        <Label htmlFor='title'>
          Titel (optional){' '}
          <Input
            type='text'
            name='title'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Label>
      </div>
      <div className='flex gap-4 justify-end'>
        <CSVLink
          data={studentsCSV}
          headers={[
            { label: '', key: 'index' },
            { label: 'Vorname', key: 'firstName' },
            { label: 'Nachname', key: 'lastName' },
            { label: 'Instrument', key: 'instrument' },
            { label: 'Tag', key: 'dayOfLesson' },
            { label: 'Von', key: 'startOfLesson' },
            { label: 'Bis', key: 'endOfLesson' },
            { label: 'Dauer', key: 'durationMinutes' },
            { label: 'Unterrichtsort', key: 'location' },
          ]}
          filename={
            title
              ? title.split(' ').join('-').toLowerCase()
              : `schüler:innen-${userNameDashes}.csv`
          }
        >
          <Button size='sm'>CSV herunterladen</Button>
        </CSVLink>
        <PDFDownloadLink
          document={
            <StudentListPDF
              students={students}
              userName={userName}
              title={title}
            />
          }
          fileName={
            title
              ? title.split(' ').join('-').toLowerCase()
              : `schüler:innen-${userNameDashes}.pdf`
          }
        >
          <Button size='sm'>PDF herunterladen</Button>
        </PDFDownloadLink>
      </div>
    </div>
  )
}

export default ExportStudentList
