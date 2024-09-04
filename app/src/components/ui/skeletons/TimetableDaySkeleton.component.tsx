import Skeleton from '../skeleton'

export default function TimetableDaySkeleton({ rows = 5 }) {
  const renderedRows = Array.from(Array(rows)).map((_, index) => index)
  return (
    <div className='mb-12 rounded-md shadow-sm w-[700px] border border-background200 bg-background50'>
      <div className='bg-background200/50 px-4 py-2 flex justify-between items-center'>
        <Skeleton className='h-6 w-16' />
        <Skeleton className='h-4 w-20' />
      </div>
      {renderedRows.map((row) => (
        <div
          key={row}
          className='h-12 text-sm odd:bg-background100 px-4 py-1 text-foreground grid items-center grid-cols-[100px_200px_80px_1fr_20px] gap-x-6 gap-y-0'
        >
          <div>
            <Skeleton className='h-4 w-20' />
          </div>
          <div className='flex gap-2 items-center'>
            <Skeleton className='h-4 w-32' />
          </div>
          <div>
            <Skeleton className='h-4 w-20' />
          </div>
          <div>
            <Skeleton className='h-4 w-24' />
          </div>
          <div>
            <Skeleton className='size-4' />
          </div>
        </div>
      ))}
    </div>
  )
}
