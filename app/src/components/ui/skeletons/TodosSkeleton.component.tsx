import Skeleton from '../skeleton'

export default function TodosSkeleton() {
  return (
    <div className='container-page'>
      <h1>
        <Skeleton className='h-8 w-[6ch]' />
      </h1>
      <div className='text-base mt-6 mb-6'>
        <ul className='p-0 flex justify-start gap-2'>
          <li className='px-1 relative overflow-hidden'>
            <Skeleton className='h-5 w-14' />
          </li>
          <li className='px-1 relative overflow-hidden'>
            <Skeleton className='h-5 w-14' />
          </li>
        </ul>
      </div>
      <div>
        <div>
          <div className='sm:border sm:h-[44px] sm:flex-row sm:items-center gap-1 w-full border-hairline sm:pr-1 rounded-md flex flex-col justify-end'>
            <div className='sm:flex sm:h-auto sm:border-none border gap-1 p-1 sm:py-[2px] px-[3px] border-hairline rounded-md grow items-center'>
              <div className='shrink grow mb-2 sm:mb-0'>
                <Skeleton className='h-8 w-full' />
              </div>
              <div className='flex h-10 sm:h-auto items-end sm:items-center gap-1 justify-between'>
                <Skeleton className='h-8 w-[52px]' />
                <div className='flex sm:mr-2 items-center'>
                  <Skeleton className='h-8 w-[42px]' />
                </div>
              </div>
            </div>
            <Skeleton className='ml-auto mt-2 sm:mt-0 sm:ml-0 h-8 w-[91px]' />
          </div>
        </div>
      </div>
      <div className='hidden p-2 md:grid opacity-70 mt-7 text-smgrid-cols-[30px_1fr_30px]'>
        <span />
        <div className='grid grid-cols-[1fr_250px_100px]'>
          <span />
          <span>
            <Skeleton className='h-5 w-32' />
          </span>
          <Skeleton className='h-5 w-16' />
        </div>
        <div />
      </div>
      <ul className='pt-10 space-y-5 sm:space-y-2 sm:pt-0'>
        <li className='flex items-center h-10 bg-background50/30 mb-2 p-2 justify-between rounded-sm shadow-sm border-background200 border'>
          <Skeleton className='h-4 w-full' />
        </li>
        <li className='flex items-center h-10 bg-background50/30 mb-2 p-2 justify-between rounded-sm shadow-sm border-background200 border'>
          <Skeleton className='h-4 w-full' />
        </li>
        <li className='flex items-center h-10 bg-background50/30 mb-2 p-2 justify-between rounded-sm shadow-sm border-background200 border'>
          <Skeleton className='h-4 w-full' />
        </li>
        <li className='flex items-center h-10 bg-background50/30 mb-2 p-2 justify-between rounded-sm shadow-sm border-background200 border'>
          <Skeleton className='h-4 w-full' />
        </li>
      </ul>
    </div>
  )
}
