import Skeleton from '@/components/ui/skeleton'

export default function ExportStudentListSkeleton() {
  return (
    <div className='space-y-8'>
      <div>
        <Skeleton className='h-5 w-full' />
        <Skeleton className='mt-2 h-5 w-2/3' />
      </div>
      <div>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='mt-2 h-10 w-full' />
      </div>
      <div className='flex justify-end gap-4'>
        <Skeleton className='h-10 w-36' />
        <Skeleton className='h-10 w-36' />
      </div>
    </div>
  )
}
