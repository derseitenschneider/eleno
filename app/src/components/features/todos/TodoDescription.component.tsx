import { cn } from '@/lib/utils'

function TodoDescription({ grid }: { grid: string }) {
  return (
    <div className={cn(grid, 'hidden md:block opacity-70 mt-6 text-sm')}>
      <div />
      <div />
      <p>Schüler:in/Gruppe</p>
      <p>Fällig</p>
    </div>
  )
}

export default TodoDescription
