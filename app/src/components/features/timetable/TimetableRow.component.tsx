import { useNavigate } from 'react-router-dom'
import type { LessonHolder } from '../../../types/types'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users } from 'lucide-react'

type TimeTableRowProps = {
  lessonHolder: LessonHolder
}

export default function TimeTableRow({ lessonHolder }: TimeTableRowProps) {
  const navigate = useNavigate()
  const { holder } = lessonHolder
  let name = ''
  if (lessonHolder.type === 's')
    name = `${lessonHolder.holder.firstName} ${lessonHolder.holder.lastName}`

  if (lessonHolder.type === 'g') name = lessonHolder.holder.name

  function navigateTolesson() {
    navigate(`/lessons/${lessonHolder.type}-${lessonHolder.holder.id}`)
  }

  return (
    <div
      className='text-sm odd:bg-background100 px-4 py-1 text-foreground grid items-center grid-cols-[100px_150px_80px_1fr_20px] gap-x-6 gap-y-0'
      key={holder.id}
    >
      <div>
        {holder.startOfLesson && (
          <>
            {holder.startOfLesson.slice(0, 5)} –{' '}
            {holder.endOfLesson?.slice(0, 5)}
          </>
        )}
      </div>
      <div className='flex gap-2 items-center'>
        {lessonHolder.type === 'g' && <Users className='size-4' />}
        {name}
      </div>
      <div>{lessonHolder.type === 's' && lessonHolder.holder.instrument}</div>
      <div>{holder.location}</div>
      <Button className='p-0' variant='ghost' onClick={navigateTolesson}>
        <ArrowRight strokeWidth={1.5} className='text-primary size-4' />
      </Button>
    </div>
  )
}
