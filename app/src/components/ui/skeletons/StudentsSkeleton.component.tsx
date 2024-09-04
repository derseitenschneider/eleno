import Skeleton from '@/components/ui/skeleton'
import TableSkeleton from './TableSkeleton.component'

export default function StudentsSkeleton() {
  return (
    <div className='*:pr-4 *:pl-6 pb-4 py-4'>
      <header>
        <Skeleton className='h-8 w-[20ch]' />
      </header>
      <div className='text-base mt-6 mb-6'>
        <ul className='p-0 flex justify-start gap-2'>
          <li className='relative overflow-hidden'>
            <Skeleton className='h-5 w-24' />
          </li>
          <li className='relative overflow-hidden'>
            <Skeleton className='h-5 w-20' />
          </li>
          <li className='relative overflow-hidden'>
            <Skeleton className='h-5 w-20' />
          </li>
        </ul>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-5 w-32' />
        </div>
        <div className='flex items-center sm:gap-4'>
          <Skeleton className='h-8 w-[120px]' />
          <Skeleton className='h-8 w-[210px]' />
          <Skeleton className='h-8 w-[70px]' />
        </div>
      </div>
      <div className='mt-4'>
        <TableSkeleton rows={9} />
      </div>
    </div>
  )
}
