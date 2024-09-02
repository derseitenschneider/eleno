import type { TimetableDay } from '../../../types/types'

import TimeTableRow from './TimetableRow.component'

interface TimeTableDayProps {
  day: TimetableDay
}

export default function TimeTableDay({ day }: TimeTableDayProps) {
  return (
    <div className='mb-12 rounded-md shadow-sm w-[700px] border border-background200 bg-background50'>
      <div className='bg-background200/50 px-4 py-2 flex justify-between items-center'>
        <h5 className='text-foreground/80 m-0'>
          {day.day || 'Kein Tag angegeben '}
        </h5>

        <span className='text-sm text-foreground/70'>
          Lektionen: {day.lessonHolders.length}
        </span>
      </div>
      {day.lessonHolders.map((lessonHolder) => (
        <TimeTableRow
          lessonHolder={lessonHolder}
          key={`${lessonHolder.type}-${lessonHolder.holder.id}`}
        />
      ))}
    </div>
  )
}
