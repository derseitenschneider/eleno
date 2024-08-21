import { cn } from '@/lib/utils'

function TodoDescription() {
  return (
    <div
      className={cn(
        'hidden p-2 md:grid opacity-70 mt-6 text-sm',
        'grid-cols-[30px_1fr_30px]',
      )}
    >
      <span />
      <div className='grid grid-cols-[1fr_250px_100px]'>
        <span />
        <span>Schüler:in/Gruppe</span>
        <span>Fällig</span>
      </div>
      <div />
    </div>
  )
}

export default TodoDescription
