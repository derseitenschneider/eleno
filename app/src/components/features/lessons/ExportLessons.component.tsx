import { useQueryClient } from '@tanstack/react-query'
import { createElement, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import ButtonRemove from '@/components/ui/buttonRemove'
import { Checkbox } from '@/components/ui/checkbox'
import { DayPicker } from '@/components/ui/daypicker.component'
import { DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MiniLoader from '@/components/ui/MiniLoader.component'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { sanitizeHTMLforPDF } from '@/utils/sanitizeHTML'
import type { Group, LessonHolder, Student } from '../../../types/types'
import stripHtmlTags from '../../../utils/stripHtmlTags'
import type { PDFProps } from '../pdf/types'
import { useAllLessons, useAllLessonsCSV } from './lessonsQueries'

type ExportLessonsProps = {
  holderId: number
  holderType: 's' | 'g'
  onSuccess: () => void
}

function ExportLessons({
  holderId,
  holderType,
  onSuccess,
}: ExportLessonsProps) {
  const fetchErrorToast = useFetchErrorToast()
  const queryClient = useQueryClient()
  const { userLocale } = useUserLocale()

  const allStudents = queryClient.getQueryData(['students']) as Array<Student>
  const allGroups = queryClient.getQueryData(['groups']) as Array<Group>

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectAll, setSelectAll] = useState(false)
  const [title, setTitle] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const selectedHolder =
    holderType === 's'
      ? ({
          type: 's',
          holder: allStudents.find((student) => student.id === holderId),
        } as LessonHolder)
      : ({
          type: 'g',
          holder: allGroups.find((group) => group.id === holderId),
        } as LessonHolder)

  const { refetch: fetchAllLessons } = useAllLessons(
    [holderId],
    holderType,
    startDate,
    endDate,
  )
  const { refetch: fetchAllLessonsCSV } = useAllLessonsCSV(
    [holderId],
    holderType,
    startDate,
    endDate,
  )

  const canDownload = (startDate && endDate) || selectAll
  if (!selectedHolder) return null

  const holderFullName =
    selectedHolder.type === 's'
      ? `${selectedHolder.holder.firstName} ${selectedHolder.holder.lastName}`
      : selectedHolder.holder?.name

  const holderFullNameDashes = holderFullName
    ?.split(' ')
    .map((part) => part.toLowerCase())
    .join('-')

  function handleStartDate(date: Date | undefined) {
    setStartDate(date)
    setSelectAll(false)
  }

  function handleEndDate(date: Date | undefined) {
    setEndDate(date)
    setSelectAll(false)
  }

  function handleSelectAll() {
    setSelectAll((prev) => {
      if (!prev) {
        setStartDate(undefined)
        setEndDate(undefined)
      }
      return !prev
    })
  }

  async function handleDownloadCSV() {
    try {
      setIsLoading(true)
      const { data } = await fetchAllLessonsCSV()
      if (!data) throw new Error()

      const dateRegex = /(\d{4})-(\d{2})-(\d{2})/g
      function localizeDate(match: string) {
        const date = new Date(match)
        return date.toLocaleString(userLocale, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
      }

      const localizedCsv = data.replace(dateRegex, localizeDate)

      const blob = new Blob([stripHtmlTags(localizedCsv)], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.setAttribute(
        'download',
        title ? `${title}.csv` : `lektionsliste-${holderFullNameDashes}.csv`,
      )
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()

      toast.success('Datei heruntergeladen.')
      URL.revokeObjectURL(url)
      document.body.removeChild(link)
      onSuccess()
    } catch (_e) {
      fetchErrorToast()
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDownloadPDF() {
    try {
      setIsLoading(true)

      const module = 'index'
      const { pdf, LessonsPDF } = await import(`../pdf/${module}.ts`)

      const { data: allLessons } = await fetchAllLessons()
      const localizedLessons = allLessons?.map((lesson) => ({
        ...lesson,
        lessonContent: lesson.lessonContent
          ? sanitizeHTMLforPDF(lesson.lessonContent)
          : '',
        homework: lesson.homework ? sanitizeHTMLforPDF(lesson.homework) : '',
        date: lesson.date.toLocaleDateString(userLocale, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }),
        attendance_status: lesson.attendance_status,
        absence_reason: lesson.absence_reason,
      }))

      if (!allLessons) return
      const props: PDFProps = {
        title,
        lessons: localizedLessons,
        studentFullName: holderFullName,
      }
      const blob = await pdf(createElement(LessonsPDF, props)).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        title ? `${title}.pdf` : `lektionsliste-${holderFullNameDashes}.pdf`,
      )
      link.style.display = 'none'

      document.body.appendChild(link)
      link.click()

      toast.success('Datei heruntergeladen.')
      URL.revokeObjectURL(url)
      document.body.removeChild(link)
      onSuccess()
    } catch (_e) {
      fetchErrorToast()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-[500px]'>
      <DialogDescription>
        Exportiere die Lektionsliste von{' '}
        <b className='text-primary'>{holderFullName}</b>. Du kannst entweder
        einen bestimmten Zeitraum wählen oder sämtliche erfassten Lektionen
        exportieren.
      </DialogDescription>
      <h5 className='mt-5'>Zeitraum</h5>
      <div className='mb-4 grid grid-cols-[140px_140px]'>
        <div className='flex grow-0 flex-col items-start gap-2'>
          <span>Von</span>
          <div className='flex items-center'>
            <DayPicker setDate={handleStartDate} date={startDate} />
            {startDate && (
              <ButtonRemove
                className='translate-x-[-50%]'
                onRemove={() => setStartDate(undefined)}
              />
            )}
          </div>
        </div>
        <div className='flex grow-0 flex-col items-start gap-2'>
          <span>Bis</span>
          <div className='flex items-center'>
            <DayPicker setDate={handleEndDate} date={endDate} />
            {endDate && (
              <ButtonRemove
                className='translate-x-[-50%]'
                onRemove={() => setEndDate(undefined)}
              />
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center'>
        <Checkbox
          name='select-all'
          id='select-all'
          onCheckedChange={handleSelectAll}
          checked={selectAll}
        />

        <Label htmlFor='select-all' className='ml-2 text-sm'>
          Alle Lektionen exportieren
        </Label>
      </div>

      <div className='mb-8 mt-5'>
        <Label htmlFor='title' className='text-sm'>
          Titel (optional){' '}
        </Label>
        <Input
          placeholder='Titel'
          className='w-[35ch]'
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

      <div className='flex items-center justify-end gap-4'>
        <Button
          onClick={handleDownloadCSV}
          size='sm'
          disabled={!canDownload || isLoading}
        >
          CSV herunterladen
        </Button>

        <div className='flex items-center gap-2'>
          <Button
            size='sm'
            disabled={!canDownload || isLoading}
            onClick={handleDownloadPDF}
          >
            PDF herunterladen
          </Button>
          {isLoading && (
            <div className='text-primary '>
              <MiniLoader />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExportLessons
