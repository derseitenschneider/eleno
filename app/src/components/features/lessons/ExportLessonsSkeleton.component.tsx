import Skeleton from '@/components/ui/skeleton'

export default function ExportLessonsSkeleton() {
  return (
    <div className='w-[500px]'>
      <div className='space-y-2'>
        <Skeleton className='h-5 w-full' />
        <Skeleton className='h-5 w-2/3' />
      </div>
      <div className='mt-5 space-y-2'>
        <Skeleton className='h-4 w-24' />
        <div className='grid grid-cols-[140px_140px] gap-4'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>
      <div className='mt-4 flex items-center'>
        <Skeleton className='h-6 w-6' />
        <Skeleton className='ml-2 h-5 w-40' />
      </div>
      <div className='mb-8 mt-5 space-y-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-10 w-[35ch]' />
      </div>
      <div className='flex justify-end gap-4'>
        <Skeleton className='h-10 w-36' />
        <Skeleton className='h-10 w-36' />
      </div>
    </div>
  )
}
