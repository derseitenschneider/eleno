import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CSVLink } from 'react-csv'

import type { Group } from '../../../types/types'

import { useUser } from '../../../services/context/UserContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import GrouplistPDF from '../pdf/GrouplistPDF.component'

interface ExportGroupListProps {
  groups: Group[]
}

export default function ExportGroupList({ groups }: ExportGroupListProps) {
  const [title, setTitle] = useState('')
  const { user } = useUser()

  const userName = `${user?.firstName} ${user?.lastName}`

  const groupsCSV = groups.map((group, index) => ({
    index: index + 1,
    name: group.name,
    dayOfLesson: group.dayOfLesson ?? '–',
    startOfLesson: group.startOfLesson?.substring(0, 5) ?? '–',
    endOfLesson: group.endOfLesson?.substring(0, 5) ?? '–',
    durationMinutes: group.durationMinutes ?? '–',
    location: group.location ?? '–',
  }))

  const userNameDashes = userName.toLowerCase().split(' ').join('-')

  return (
    <div className='space-y-8'>
      <p>Exportiere eine Liste mit allen aktiven Gruppen.</p>
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
        <PDFDownloadLink
          document={
            <GrouplistPDF groups={groups} userName={userName} title={title} />
          }
          fileName={
            title
              ? title.split(' ').join('-').toLowerCase()
              : `gruppen-${userNameDashes}.pdf`
          }
        >
          <Button size='sm'>PDF herunterladen</Button>
        </PDFDownloadLink>

        <CSVLink
          data={groupsCSV}
          headers={[
            { label: '', key: 'index' },
            { label: 'Name', key: 'name' },
            { label: 'Tag', key: 'dayOfLesson' },
            { label: 'Von', key: 'startOfLesson' },
            { label: 'Bis', key: 'endOfLesson' },
            { label: 'Dauer', key: 'durationMinutes' },
            { label: 'Unterrichtsort', key: 'location' },
          ]}
          filename={
            title
              ? title.split(' ').join('-').toLowerCase()
              : `gruppen-${userNameDashes}.csv`
          }
        >
          <Button size='sm'>CSV herunterladen</Button>
        </CSVLink>
      </div>
    </div>
  )
}
