import Empty from '@/components/ui/Empty.component'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { FileDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import ExportTimetable from '../components/features/timetable/ExportTimetable'
import TimeTableDay from '../components/features/timetable/TimetableDay.component'
import type { TimetableDay } from '../types/types'
import { sortLessonHolders } from '../utils/sortLessonHolders'

export default function Timetable() {
  const { activeSortedHolders: lessonHolders } = useLessonHolders()
  const [modalOpen, setModalOpen] = useState<'EXPORT'>()

  function closeModal() {
    setModalOpen(undefined)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sortedLessonHolders = sortLessonHolders(
    lessonHolders.filter((lessonHolder) => !lessonHolder.holder.archive),
  )
  const monday: TimetableDay = {
    day: 'Montag',
    lessonHolders: [],
  }
  const tuesday: TimetableDay = {
    day: 'Dienstag',
    lessonHolders: [],
  }
  const wednesday: TimetableDay = {
    day: 'Mittwoch',
    lessonHolders: [],
  }
  const thursday: TimetableDay = {
    day: 'Donnerstag',
    lessonHolders: [],
  }
  const friday: TimetableDay = {
    day: 'Freitag',
    lessonHolders: [],
  }
  const saturday: TimetableDay = {
    day: 'Samstag',
    lessonHolders: [],
  }
  const sunday: TimetableDay = {
    day: 'Sonntag',
    lessonHolders: [],
  }
  const noDayAssigned: TimetableDay = {
    day: null,
    lessonHolders: [],
  }
  for (const lessonHolder of sortedLessonHolders) {
    switch (lessonHolder.holder.dayOfLesson) {
      case 'Montag':
        monday.lessonHolders.push(lessonHolder)
        break

      case 'Dienstag':
        tuesday.lessonHolders.push(lessonHolder)
        break

      case 'Mittwoch':
        wednesday.lessonHolders.push(lessonHolder)
        break

      case 'Donnerstag':
        thursday.lessonHolders.push(lessonHolder)
        break

      case 'Freitag':
        friday.lessonHolders.push(lessonHolder)
        break

      case 'Samstag':
        saturday.lessonHolders.push(lessonHolder)
        break

      case 'Sonntag':
        sunday.lessonHolders.push(lessonHolder)
        break

      default:
        noDayAssigned.lessonHolders.push(lessonHolder)
    }
  }

  const days = [
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    noDayAssigned,
  ]

  return (
    <div className='pb-8'>
      <div className='mb-4 hidden sm:block'>
        {days.some((day) => day.lessonHolders.length > 0) && (
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              setModalOpen('EXPORT')
            }}
          >
            <FileDown className='mr-1 h-4 w-4 text-primary' />
            Exportieren
          </Button>
        )}
      </div>
      {days.some((day) => day.lessonHolders.length) ? (
        <>
          {days.map((day) =>
            day.lessonHolders.length ? (
              <TimeTableDay day={day} key={day.day} />
            ) : null,
          )}
        </>
      ) : (
        <Empty
          emptyMessage='Keine Unterrichtsdaten vorhanden.'
          className='mt-8'
        >
          <p className='mt-8 max-w-[60ch] text-center'>
            Ergänze die Unterrichtsdaten (Zeit, Unterrichtstag, Unterrichtsort)
            deiner Schüler:innen, damit diese im Stundenplan erscheinen.
          </p>
        </Empty>
      )}

      <Dialog open={modalOpen === 'EXPORT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stundenplan exportieren</DialogTitle>
          </DialogHeader>
          <ExportTimetable days={days} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
