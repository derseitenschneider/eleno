import { createElement, useState } from 'react'
import type { Group, LessonHolder, Student } from '../../../types/types'

import { Button } from '@/components/ui/button'
import { DayPicker } from '@/components/ui/daypicker.component'
import stripHtmlTags from '../../../utils/stripHtmlTags'
import ButtonRemove from '@/components/ui/buttonRemove/ButtonRemove'
import { Input } from '@/components/ui/input'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import fetchErrorToast from '@/hooks/fetchErrorToast'
import { useAllLessons, useAllLessonsCSV } from './lessonsQueries'
import type { PDFProps } from './LessonsPDF'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useLessonPointer } from '@/services/context/LessonPointerContext'

type BulkExportLessonsProps = {
  holderIds: Array<number>
  holderType: 's' | 'g'
  onSuccess: () => void
}

function BulkExportLessons({
  holderIds,
  holderType,
  onSuccess,
}: BulkExportLessonsProps) {
  const { userLocale } = useUserLocale()
  const { lessonHolders } = useLessonPointer()

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectAll, setSelectAll] = useState(false)
  const [title, setTitle] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const { refetch: fetchAllLessons } = useAllLessons(
    holderIds,
    holderType,
    startDate,
    endDate,
  )
  const { refetch: fetchAllLessonsCSV } = useAllLessonsCSV(
    holderIds,
    holderType,
    startDate,
    endDate,
  )

  const canDownload = (startDate && endDate) || selectAll
  if (!holderIds || holderIds.lenght === 0) return null

  const holderFullName =
    holderType === 's'
      ? `${selectedHolder.holder.firstName} ${selectedHolder.holder.lastName}`
      : selectedHolder.holder.name

  const holderFullNameDashes = holderFullName
    .split(' ')
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
    } catch (e) {
      fetchErrorToast()
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDownloadPDF() {
    try {
      setIsLoading(true)

      const { pdf } = await import('@react-pdf/renderer')
      const { LessonsPDF } = await import('./LessonsPDF')

      const { data: allLessons } = await fetchAllLessons()

      if (!allLessons) return
      const props: PDFProps = {
        title,
        lessons: allLessons,
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
    } catch (e) {
      fetchErrorToast()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-[500px]'>
      <p>
        Exportiere die Lektionslisten der ausgewählten{' '}
        {holderType === 's' ? 'Schüler:innen' : 'Gruppen'}. Du kannst entweder
        einen bestimmten Zeitraum wählen oder sämtliche erfassten Lektionen
        exportieren
      </p>
      <h5 className='mt-5'>Zeitraum</h5>
      <div className='mb-4 grid grid-cols-[140px_140px]'>
        <div className='flex flex-col gap-2 items-start grow-0'>
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
        <div className='flex flex-col gap-2 items-start grow-0'>
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

        <Label htmlFor='select-all' className='text-sm ml-2'>
          Alle Lektionen exportieren
        </Label>
      </div>

      <div className='mt-8 mb-4'>
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

      <div className='flex items-center gap-5'>
        <Button
          size='sm'
          disabled={!canDownload || isLoading}
          onClick={handleDownloadPDF}
        >
          PDF herunterladen
        </Button>

        <Button
          onClick={handleDownloadCSV}
          size='sm'
          disabled={!canDownload || isLoading}
        >
          CSV herunterladen
        </Button>
        {isLoading && (
          <div className='text-primary '>
            <MiniLoader />
          </div>
        )}
      </div>
    </div>
  )
}

export default ExportLessons
