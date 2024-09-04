import Skeleton from '../../skeleton'
import TableSkeleton from '../TableSkeleton.component'

export default function AllLessonsSkeleton() {
  return (
    <div className='mb-14 sm:mb-10'>
      <div className='flex gap-4 justify-between mb-4 items-center sm:items-start'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-[101px]' />
        </div>
        <div className='flex items-center sm:gap-4'>
          <Skeleton className='h-9 w-20' />
          <Skeleton className='hidden sm:block h-8 w-[124px]' />
          <Skeleton className='hidden sm:block h-8 w-[210px]' />
        </div>
      </div>
      <TableSkeleton />
    </div>
  )
}
