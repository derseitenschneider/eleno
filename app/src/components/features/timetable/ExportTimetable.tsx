import { createElement, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MiniLoader from '@/components/ui/MiniLoader.component'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import sortTimeTableDays from '@/utils/sortTimetableDays'
import type { TimetableDay } from '../../../types/types'
import useProfileQuery from '../user/profileQuery'

interface ExportTimeTableProps {
  days: TimetableDay[]
}

function ExportTimetable({ days }: ExportTimeTableProps) {
  const { data: userProfile } = useProfileQuery()
  const [selectedDays, setSelectedDays] = useState<TimetableDay[]>([])
  const [title, setTitle] = useState('')
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)
  const fetchErrorToast = useFetchErrorToast()

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

  async function handleDownloadPDF() {
    if (selectedDays.length === 0) return
    
    try {
      setIsLoadingPDF(true)
      
      // Dynamically import the PDF bundle
      const { pdf, TimetablePDF } = await import('../pdf')
      
      const props = {
        days: selectedDaysSorted,
        title,
        userName,
      }
      
      const blob = await pdf(createElement(TimetablePDF, props)).toBlob()
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const fileName = title
        ? title.split(' ').join('-').toLowerCase()
        : `stundenplan-${userNameDashes}.pdf`
      
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
        <div className='flex items-center gap-2'>
          <Button
            variant='default'
            className='mt-4'
            size='sm'
            disabled={selectedDays.length === 0 || isLoadingPDF}
            onClick={handleDownloadPDF}
          >
            PDF herunterladen
          </Button>
          {isLoadingPDF && (
            <div className='text-primary mt-4'>
              <MiniLoader />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExportTimetable
