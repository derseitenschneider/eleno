import type { TimetableDay } from '../../../types/types'

import TimeTableRow from './TimetableRow.component'

interface TimeTableDayProps {
  day: TimetableDay
}

export default function TimeTableDay({ day }: TimeTableDayProps) {
  return (
    <div className='mb-12 shadow-sm w-[700px] border border-background200 bg-background50'>
      <div className='bg-background200 px-4 py-2 flex justify-between items-baseline'>
        <h4>{day.day}</h4>

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
