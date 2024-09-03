import Skeleton from '../../skeleton'

export default function HeaderSkeleton() {
  return (
    <header className='sm:pr-4 sm:h-[88px] sm:pl-6 sm:py-4 z-10 bg-background100 px-5 py-4 right-0  left-0 md:left-[50px] top-0 border-b border-hairline'>
      <div className='flex items-end justify-between'>
        <div className='w-full'>
          <div className='flex sm:mb-1 items-center '>
            <div className='flex items-center mb-3'>
              <div className='mr-[4px]'>
                <Skeleton className='size-5 rounded-full' />
              </div>
              <span className='mr-2'>
                <Skeleton className='h-5 w-36 rounded-md' />
              </span>
            </div>
          </div>
          <div>
            <Skeleton className='h-4 w-60' />
          </div>
        </div>
        <Skeleton className='hidden sm:block w-28 h-8' />
      </div>
    </header>
  )
}
