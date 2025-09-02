import { useQueryClient } from '@tanstack/react-query'
import { createElement, useState } from 'react'
import { CSVLink } from 'react-csv'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import Empty from '@/components/ui/Empty.component'
import { Input } from '@/components/ui/input'
import MiniLoader from '@/components/ui/MiniLoader.component'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { LessonHolder, RepertoireItem } from '../../../types/types'

type ExportRepertoireProps = { lessonHolder: LessonHolder }

function ExportRepertoire({ lessonHolder }: ExportRepertoireProps) {
  const queryClient = useQueryClient()
  const { userLocale } = useUserLocale()
  const [title, setTitle] = useState('')
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)
  const fetchErrorToast = useFetchErrorToast()

  const repertoire = queryClient.getQueryData([
    'repertoire',
    { holder: `${lessonHolder.type}-${lessonHolder.holder.id}` },
  ]) as Array<RepertoireItem> | undefined

  const holderName =
    lessonHolder.type === 's'
      ? `${lessonHolder.holder.firstName} ${lessonHolder.holder.lastName}`
      : lessonHolder.holder.name

  const holderNameDashes = holderName.split(' ').join('-').toLowerCase()

  if (!repertoire || repertoire.length === 0)
    return (
      <div className='w-[500px] h-50'>
        <Empty emptyMessage='Keine Songs vorhanden' />
      </div>
    )

  const localizedRepertoire = repertoire.map((item) => ({
    ...item,
    startDate: item.startDate?.toLocaleDateString(userLocale, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }),
    endDate: item.endDate?.toLocaleDateString(userLocale, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }),
  }))

  const repertoireCSV = repertoire.map((item, index) => ({
    index: index + 1,
    title: item.title,
    startDate: item.startDate
      ? item.startDate.toLocaleDateString(userLocale, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
      : '',
    endDate: item.endDate
      ? item.endDate.toLocaleDateString(userLocale, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
      : '',
  }))

  async function handleDownloadPDF() {
    try {
      setIsLoadingPDF(true)
      
      // Dynamically import the PDF bundle
      const { pdf, RepertoirePDF } = await import('../pdf')
      
      const props = {
        studentFullName: holderName,
        repertoire: localizedRepertoire,
        title,
      }
      
      const blob = await pdf(createElement(RepertoirePDF, props)).toBlob()
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const fileName = title
        ? title.split(' ').join('-').toLowerCase()
        : `repertoire-${holderNameDashes}.pdf`
      
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
      <p>
        Exportiere die Repertoireliste von <b>{holderName}</b>.
      </p>
      <div>
        <label htmlFor='title'>
          Titel (optional)
          <Input
            type='text'
            name='titel'
            id='titel'
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target
              setTitle(value)
            }}
          />
        </label>
      </div>
      <div className='flex gap-4 justify-end'>
        <CSVLink
          data={repertoireCSV}
          headers={[
            { label: '', key: 'index' },
            {
              label: 'Song',
              key: 'title',
            },
            {
              label: 'Start',
              key: 'startDate',
            },
            {
              label: 'Ende',
              key: 'endDate',
            },
          ]}
          filename={
            title
              ? title.split(' ').join('-').toLowerCase()
              : `repertoire-${holderNameDashes}.csv`
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
            PDF Herunterladen
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

export default ExportRepertoire
