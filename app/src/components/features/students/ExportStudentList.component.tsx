import { createElement, useState } from 'react'
import { CSVLink } from 'react-csv'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MiniLoader from '@/components/ui/MiniLoader.component'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import type { Student } from '../../../types/types'
import useProfileQuery from '../user/profileQuery'

interface ExportStudentListProps {
  students: Student[]
}

function ExportStudentList({ students }: ExportStudentListProps) {
  const [title, setTitle] = useState('')
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)
  const { data: userProfile } = useProfileQuery()
  const fetchErrorToast = useFetchErrorToast()

  const userName = `${userProfile?.first_name} ${userProfile?.last_name}`

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

  async function handleDownloadPDF() {
    try {
      setIsLoadingPDF(true)
      
      // Dynamically import the PDF bundle
      const { pdf, StudentListPDF } = await import('../pdf')
      
      const props = {
        students,
        userName,
        title,
      }
      
      const blob = await pdf(createElement(StudentListPDF, props)).toBlob()
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const fileName = title
        ? title.split(' ').join('-').toLowerCase()
        : `schüler:innen-${userNameDashes}.pdf`
      
      link.setAttribute('download', fileName)
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      
      toast.success('Datei heruntergeladen.')
      URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (e) {
      fetchErrorToast()
    } finally {
      setIsLoadingPDF(false)
    }
  }

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
      <div className='flex justify-end gap-4'>
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
        <div className='flex items-center gap-2'>
          <Button 
            size='sm' 
            onClick={handleDownloadPDF}
            disabled={isLoadingPDF}
          >
            PDF herunterladen
          </Button>
          {isLoadingPDF && (
            <div className='text-primary'>
              <MiniLoader />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExportStudentList
