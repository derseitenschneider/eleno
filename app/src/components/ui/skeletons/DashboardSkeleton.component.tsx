import Skeleton from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function DashboardSkeleton() {
  return (
    <div className='md:h-screen md:min-h-[700px] min-[900px]:grid grid-cols-[3fr_minmax(350px,_1fr)] grid-rows-[auto_auto_1fr_auto]'>
      {/* Header */}
      <header
        className={cn(
          'px-5 py-6 sm:py-6',
          'md:p-4 md:pl-6',
          'col-span-2 flex justify-between border-b border-hairline',
        )}
      >
        <div>
          <h1>Dashboard</h1>
          <Skeleton className='h-[21px] w-[240px]' />
        </div>
        <Skeleton className='h-[24px] w-[40px] rounded-full space-y-[20px]' />
      </header>

      {/* Quick-Links */}
      <div
        className={cn(
          'px-5 py-6',
          'md:p-4 md:pl-6',
          'col-span-1 row-start-2 row-end-3 border-b border-hairline',
        )}
      >
        <Skeleton className='h-[26px] w-[125px] mb-6 sm:mb-[31.5px]' />
        <div className='flex gap-x-8 gap-y-[22px] sm:gap-y-5 flex-wrap'>
          <Skeleton className='h-[20px] w-[140px] space-y-[20px]' />
          <Skeleton className='h-[20px] w-[150px] space-y-[20px]' />
          <Skeleton className='h-[20px] w-[120px] space-y-[20px]' />
          <Skeleton className='h-[20px] w-[110px] space-y-[20px]' />
          <Skeleton className='hidden sm:block h-[18px] w-[150px] space-y-[20px]' />
        </div>
      </div>

      {/* Overview */}
      <div className={cn('px-5 py-6', 'md:p-4 md:pl-6', 'row-start-3 ')}>
        <Skeleton className='h-[30px] w-[125px] mb-[24px]' />
        <div className='grid sm:grid-cols-2 content-stretch gap-5 sm:gap-5'>
          <Skeleton className='h-[160px]' />
          <Skeleton className='h-[160px] w-[100%]' />
        </div>
      </div>

      {/* News */}
      <aside
        className={cn(
          'px-3 py-6',
          'md:p-4 md:pl-6',
          'min-[900px]:p-4',
          'sm:row-start-2 border-t overflow-hidden min-[900px]:border-t-0 min-[900px]:border-l border-hairline row-end-4 col-start-2',
        )}
      >
        <Skeleton className='h-[30px] w-[80px] mb-[31.5px]' />

        <Skeleton className='h-[16px] w-[80px] mb-[8px]' />
        <Skeleton className='h-[24px] w-[100%] mb-[12px]' />
        <Skeleton className='h-[200px] w-[100%] mb-[31.5px]' />

        <Skeleton className='h-[16px] w-[80px] mb-[8px]' />
        <Skeleton className='h-[24px] w-[100%] mb-[12px]' />
        <Skeleton className='h-[200px] w-[100%] mb-[31.5px]' />
      </aside>

      {/* Footer */}
      <footer className='border-t border-hairline col-start-1 gap-1 flex col-end-3 flex-col md:flex-row justify-center md:gap-4 flex-wrap text-[10px] !py-4 px-8'>
        <Skeleton className='h-[12px] w-[120px]' />
        <Skeleton className='h-[12px] w-[100px]' />
        <Skeleton className='h-[12px] w-[80px]' />
        <Skeleton className='h-[12px] w-[240px]' />
        <Skeleton className='h-[12px] w-[80px]' />
      </footer>
    </div>
  )
}
