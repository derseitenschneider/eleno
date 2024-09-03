import Skeleton from '../../skeleton'

export default function PreviousLessonsSkeleton() {
  return (
    <div className='sm:pr-3 px-5 pt-6 pb-4 sm:pl-6 sm:py-4 border-b border-hairline sm:h-[350px] md:h-[300px] relative'>
      <div className='flex h-fit items-baseline gap-x-3 gap-y-3 mb-6'>
        <Skeleton className='rounded-sm h-8 w-20' />
        <Skeleton className='rounded-sm h-8 w-20' />
        <Skeleton className='rounded-sm h-8 w-20' />
        <Skeleton className='rounded-sm h-8 w-20 ml-auto sm:ml-3' />
      </div>
      <div>
        <div className='grid md:grid-cols-2 gap-6'>
          <div>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-3 w-32 mt-4' />
            <Skeleton className='h-3 w-36 mt-2' />
            <Skeleton className='h-3 w-36 mt-2' />
            <Skeleton className='h-3 w-32 mt-2' />
          </div>
          <div>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-3 w-36 mt-4' />
            <Skeleton className='h-3 w-36 mt-2' />
            <Skeleton className='h-3 w-32 mt-2' />
          </div>
        </div>
        <div className='absolute items-center bottom-4 right-5 flex gap-4'>
          <Skeleton className='h-4 w-5' />
          <Skeleton className='h-4 w-5' />
        </div>
      </div>
    </div>
  )
}
