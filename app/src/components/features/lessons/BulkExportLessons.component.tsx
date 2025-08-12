import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import { createElement, useState } from 'react'

import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button } from '@/components/ui/button'
import ButtonRemove from '@/components/ui/buttonRemove'
import { Checkbox } from '@/components/ui/checkbox'
import { DayPicker } from '@/components/ui/daypicker.component'
import { DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { fetchAllLessonsCSVApi } from '@/services/api/lessons.api'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { useUser } from '@/services/context/UserContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import stripHtmlTags from '@/utils/stripHtmlTags'
import JSZip from 'jszip'
import { toast } from 'sonner'
import type { PDFProps } from './LessonsPDF'
import { useAllLessons, useAllLessonsCSV } from './lessonsQueries'

type BulkExportLessonsProps = {
  holderIds: Array<number>
  holderType: 's' | 'g'
  onSuccess: () => void
}

export default function BulkExportLessons({
  holderIds,
  holderType,
  onSuccess,
}: BulkExportLessonsProps) {
  const { user } = useUser()
  const { userLocale } = useUserLocale()
  const { activeSortedHolders: lessonHolders } = useLessonHolders()
  const fetchErrorToast = useFetchErrorToast()

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectAll, setSelectAll] = useState(false)

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
  if (!holderIds || holderIds.length === 0) return null

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
      if (!data || data.length === 0)
        return toast.warning('Keine Lektionen vorhanden.')

      const groupedCSV = await Promise.all(
        holderIds.map(async (id) => {
          let holderName = ''
          const currentHolder = lessonHolders.find(
            (lessonHolder) => lessonHolder.holder.id === id,
          )
          if (currentHolder?.type === 's') {
            const { firstName, lastName } = currentHolder.holder
            holderName = `${firstName} ${lastName}`
          }
          if (currentHolder?.type === 'g') {
            holderName = currentHolder.holder.name
          }
          const data = await fetchAllLessonsCSVApi({
            userId: user?.id || '',
            holderIds: [id],
            holderType,
            startDate,
            endDate,
          })
          const strippedData = stripHtmlTags(data)

          const dateRegex = /(\d{4})-(\d{2})-(\d{2})/g
          function localizeDate(match: string) {
            const date = new Date(match)
            return date.toLocaleString(userLocale, {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            })
          }
          const localizedCsv = strippedData.replace(dateRegex, localizeDate)
          return { holderName, csv: localizedCsv }
        }),
      )

      const zipCSV = new JSZip()

      for (const csvData of groupedCSV) {
        zipCSV.file(
          `lektionsliste-${csvData.holderName
            .split(' ')
            .join('-')
            .toLowerCase()}.csv`,
          csvData.csv,
        )
      }

      const csvBlob = await zipCSV.generateAsync({ type: 'blob' })
      const csvUrl = window.URL.createObjectURL(csvBlob)
      const link = document.createElement('a')

      link.href = csvUrl
      link.setAttribute('download', 'alle-lektionen-csv.zip')
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()

      toast.success('Export abgeschlossen.')
      URL.revokeObjectURL(csvUrl)
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
      if (!allLessons || allLessons.length === 0)
        return toast.warning('Keine Lektionen vorhanden.')

      const sanitizedLessons = allLessons.map((lesson) => ({
        ...lesson,
        lessonContent: removeHTMLAttributes(lesson.lessonContent || ''),
        homework: removeHTMLAttributes(lesson.homework || ''),
        date: lesson.date.toLocaleDateString(userLocale, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }),
      }))

      const allLessonsGrouped: Record<
        string,
        Array<{
          id: number
          date: string
          lessonContent: string | null
          homework: string | null
        }>
      > = {}

      for (const lesson of sanitizedLessons) {
        const fieldName = lesson.studentId ? 'studentId' : 'groupId'
        const currentHolder = lessonHolders.find(
          (lessonHolder) => lessonHolder.holder.id === lesson[fieldName],
        )
        let holderName = ''
        if (currentHolder?.type === 's') {
          const { firstName, lastName } = currentHolder.holder
          holderName = `${firstName} ${lastName}`
        }
        if (currentHolder?.type === 'g') {
          holderName = currentHolder.holder.name
        }

        if (Object.keys(allLessonsGrouped).includes(holderName)) {
          allLessonsGrouped[holderName]?.push(lesson)
        } else {
          allLessonsGrouped[holderName] = [lesson]
        }
      }

      const pdfBlobs = await Promise.all(
        Object.keys(allLessonsGrouped).map(async (student) => {
          const props: PDFProps = {
            lessons: allLessonsGrouped[student] || [],
            studentFullName: student,
          }
          const blob = await pdf(createElement(LessonsPDF, props)).toBlob()
          return {
            name: `lektionsliste-${student
              .split(' ')
              .join('-')
              .toLowerCase()}.pdf`,
            blob,
          }
        }),
      )
      const zipPDF = new JSZip()
      for (const { name, blob } of pdfBlobs) {
        zipPDF.file(name, blob)
      }
      const dataPDF = await zipPDF.generateAsync({ type: 'blob' })
      const dataURLPDF = window.URL.createObjectURL(dataPDF)

      const link = document.createElement('a')
      link.href = dataURLPDF
      link.setAttribute('download', 'alle-lektionen-pdf.zip')
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(dataURLPDF)
      document.body.removeChild(link)
      toast.success('Export abgeschlossen.')
    } catch (e) {
      fetchErrorToast()
    } finally {
      setIsLoading(false)
      onSuccess?.()
    }
  }


  return (
    <div className='w-[500px]'>
      <DialogDescription>
        Exportiere die Lektionslisten der ausgewählten{' '}
        {holderType === 's' ? 'Schüler:innen' : 'Gruppen'}. Du kannst entweder
        einen bestimmten Zeitraum wählen oder sämtliche erfassten Lektionen
        exportieren
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

      <div className='mb-7 flex items-center'>
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

      <div className='flex items-center justify-end gap-5'>
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
