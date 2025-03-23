import type { TimetableDay } from '../../../types/types'

import TimeTableRow from './TimetableRow.component'

interface TimeTableDayProps {
  day: TimetableDay
}

export default function TimeTableDay({ day }: TimeTableDayProps) {
  return (
    <div className='mb-12 rounded-md border border-background200 lg:w-[700px]'>
      <div className='flex items-center justify-between border-b border-hairline px-4 py-2'>
        <h5 className='m-0 text-foreground/80'>
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
