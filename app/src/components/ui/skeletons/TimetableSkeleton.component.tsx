import Skeleton from '../skeleton'
import TimetableDaySkeleton from './TimetableDaySkeleton.component'

export default function TimetableSkeleton() {
  return (
    <div className='py-4 pl-6 pr-4'>
      <div className='flex gap-10 mb-[18px]'>
        <h1>Stundenplan</h1>
        <Skeleton className='h-8 w-[120px]' />
      </div>
      <TimetableDaySkeleton rows={7} />
      <TimetableDaySkeleton />
    </div>
  )
}
