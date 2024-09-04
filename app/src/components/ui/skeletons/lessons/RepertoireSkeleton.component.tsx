import Skeleton from '../../skeleton'
import TableSkeleton from '../TableSkeleton.component'

export default function RepertoireSkeleton() {
  return (
    <div className='mb-14'>
      <div className='flex items-center justify-between mb-3'>
        <Skeleton className='h-6 w-[101px]' />
      </div>
      <h2>
        <Skeleton className='h-7 w-[90px]' />
      </h2>
      <div className='flex gap-2 items-end sm:items-center sm:mb-12 mb-8 mt-6'>
        <div className='grid sm:grid-cols-[1fr_auto_auto_auto] sm:gap-x-2 p-1 grid-cols-[auto_auto_1fr] rounded-md items-center sm:pr-1 border-hairline border gap-y-2 grow'>
          <div className='relative sm:col-span-1 col-span-4 sm:w-auto sm:shrink grow'>
            <Skeleton className='h-8 w-full' />
          </div>

          <div>
            <div className='flex mr-2 sm:mr-0 relative items-center'>
              <Skeleton className='w-[42px] h-8' />
            </div>
          </div>
          <div className='flex items-center relative'>
            <Skeleton className='w-[42px] h-8' />
          </div>
          <Skeleton className='ml-auto sm:ml-0 w-[97px] h-8' />
        </div>
      </div>
      <div className='sm:flex hidden items-center gap-4 mb-4'>
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
