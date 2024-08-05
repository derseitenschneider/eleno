import { cn } from '@/lib/utils'

function TodoDescription({ grid }: { grid: string }) {
  return (
    <div className={cn(grid, 'mt-6 text-sm')}>
      <div />
      <div />
      <p>Schüler:in/Gruppe</p>
      <p>Fällig</p>
    </div>
  )
}

export default TodoDescription
