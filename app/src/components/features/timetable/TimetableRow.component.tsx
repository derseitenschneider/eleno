import type { LessonHolder } from '../../../types/types'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users } from 'lucide-react'
import useNavigateToHolder from '@/hooks/useNavigateToHolder'

type TimeTableRowProps = {
  lessonHolder: LessonHolder
}

export default function TimeTableRow({ lessonHolder }: TimeTableRowProps) {
  const { navigateToHolder } = useNavigateToHolder()
  const { holder } = lessonHolder
  let name = ''
  if (lessonHolder.type === 's')
    name = `${lessonHolder.holder.firstName} ${lessonHolder.holder.lastName}`

  if (lessonHolder.type === 'g') name = lessonHolder.holder.name

  function handleClick() {
    navigateToHolder(`${lessonHolder.type}-${holder.id}`)
  }

  return (
    <div
      className='text-sm odd:bg-background100 px-4 py-1 text-foreground grid items-center grid-cols-[100px_200px_80px_1fr_20px] gap-x-6 gap-y-0'
      key={holder.id}
    >
      <div>
        {holder.startOfLesson || holder.endOfLesson ? (
          <>
            {holder.startOfLesson?.slice(0, 5)} –{' '}
            {holder.endOfLesson?.slice(0, 5)}
          </>
        ) : (
          <span className='block text-center'>—</span>
        )}
      </div>
      <div className='flex gap-2 items-center'>
        {lessonHolder.type === 'g' && <Users className='size-4' />}
        {name}
      </div>
      <div>{lessonHolder.type === 's' && lessonHolder.holder.instrument}</div>
      <div>{holder.location}</div>
      <Button className='p-0' variant='ghost' onClick={handleClick}>
        <ArrowRight strokeWidth={1.5} className='text-primary size-4' />
      </Button>
    </div>
  )
}
