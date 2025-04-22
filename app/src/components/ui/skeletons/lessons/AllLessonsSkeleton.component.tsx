import Skeleton from '../../skeleton'
import TableSkeleton from '../TableSkeleton.component'

export default function AllLessonsSkeleton() {
  return (
    <div className='mb-14 flex h-full flex-col overflow-hidden p-4 px-5 py-6 sm:mb-10 sm:py-4 sm:pl-6 sm:pr-4'>
      <div className='mb-14 sm:mb-10'>
        <div className='mb-4 flex items-center justify-between gap-4 sm:items-start'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-6 w-[101px]' />
          </div>
          <div className='flex items-center sm:gap-4'>
            <Skeleton className='h-9 w-20' />
            <Skeleton className='hidden h-8 w-[124px] sm:block' />
            <Skeleton className='hidden h-8 w-[210px] sm:block' />
          </div>
        </div>
        <TableSkeleton rows={10} />
      </div>
    </div>
  )
}
