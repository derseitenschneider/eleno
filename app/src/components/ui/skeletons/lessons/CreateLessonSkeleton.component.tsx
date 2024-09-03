import Skeleton from '../../skeleton'

export default function CreateLessonSkeleton() {
  return (
    <div className='px-5 py-6 sm:pr-4 sm:pl-6 sm:py-4'>
      <div className='flex mb-6 gap-4 items-center'>
        <Skeleton className='h-5 w-36' />
        <Skeleton className='h-6 w-20' />
      </div>
      <div className='grid md:grid-cols-2 gap-6'>
        <div>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='w-full sm:w-[461px] h-[199px] mt-3' />
        </div>
        <div>
          <Skeleton className='h-3 w-24' />
          <Skeleton className='w-full sm:w-[461px] h-[199px] mt-3' />
        </div>
      </div>
      <div className='flex mt-4 items-center gap-1'>
        <Skeleton className='h-8 w-24 ml-auto' />
      </div>
    </div>
  )
}
