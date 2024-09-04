import Skeleton from '../skeleton'

export default function TableSkeleton({ rows = 4 }) {
  const rowArray = Array.from(Array(rows)).map((_, index) => index)
  return (
    <div className='background-50 shadow w-full border border-background200'>
      <Skeleton className='w-full h-8  bg-background50 rounded-none' />
      {rowArray.map((row) => (
        <Skeleton
          key={row}
          className='w-full h-16 even:bg-background100 odd:bg-background50 rounded-none'
        />
      ))}
    </div>
  )
}
