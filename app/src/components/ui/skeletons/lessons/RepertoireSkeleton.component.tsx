import Skeleton from '../../skeleton'
import TableSkeleton from '../TableSkeleton.component'

export default function RepertoireSkeleton() {
  return (
    <div className='mb-14 flex h-full flex-col overflow-hidden p-4 px-5 py-6 sm:mb-10 sm:py-4 sm:pl-6 sm:pr-4'>
      <div className='mb-3 flex items-center justify-between'>
        <Skeleton className='h-6 w-[101px]' />
      </div>
      <h2>
        <Skeleton className='h-7 w-[90px]' />
      </h2>
      <div className='mb-8 mt-6 flex items-end gap-2 sm:mb-12 sm:items-center'>
        <div className='grid grow grid-cols-[auto_auto_1fr] items-center gap-y-2 rounded-md border border-hairline p-1 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-x-2 sm:pr-1'>
          <div className='relative col-span-4 grow sm:col-span-1 sm:w-auto sm:shrink'>
            <Skeleton className='h-8 w-full' />
          </div>

          <div>
            <div className='relative mr-2 flex items-center sm:mr-0'>
              <Skeleton className='h-8 w-[42px]' />
            </div>
          </div>
          <div className='relative flex items-center'>
            <Skeleton className='h-8 w-[42px]' />
          </div>
          <Skeleton className='ml-auto h-8 w-[97px] sm:ml-0' />
        </div>
      </div>
      <div className='mb-4 hidden items-center gap-4 sm:flex'>
        <div className='mr-auto'>
          <Skeleton className='h-6 w-[90px]' />
        </div>
        <Skeleton className='h-8 w-[120px]' />
        <Skeleton className='h-8 w-[210px]' />
      </div>
      <TableSkeleton />
    </div>
  )
}
