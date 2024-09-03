import Skeleton from '../../skeleton'

export default function NotesSkeleton() {
  return (
    <div className='border-t md:border-none border-hairline min-h-[150px] p-4 md:h-[calc(100vh-88px)]'>
      <div className='mb-6'>
        <div className='mt-2 flex justify-between items-baseline'>
          <Skeleton className='h-6 w-20' />
          <Skeleton className='h-5 w-12' />
        </div>
      </div>
      <ul className='h-full overflow-auto min-h-8 pb-20 no-scrollbar'>
        <li className='mb-6'>
          <Skeleton className='h-[130px] w-[367px]' />
        </li>
        <li>
          <Skeleton className='h-[150px] w-[367px]' />
        </li>
      </ul>
    </div>
  )
}
