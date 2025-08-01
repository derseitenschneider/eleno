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
      className='grid grid-cols-[90px_1fr_50px] items-center gap-x-6 gap-y-0 px-4 py-1 text-sm text-foreground odd:bg-background100 sm:grid-cols-[100px_200px_80px_1fr_20px]'
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
      <div className='flex items-center gap-2'>
        {lessonHolder.type === 'g' && <Users className='size-4' />}
        {name}
      </div>
      <div className='hidden sm:block'>
        {lessonHolder.type === 's' && lessonHolder.holder.instrument}
      </div>
      <div className='hidden sm:block'>{holder.location}</div>
      <Button className='p-0' variant='ghost' onClick={handleClick}>
        <ArrowRight strokeWidth={1.5} className='size-4 text-primary' />
      </Button>
    </div>
  )
}
