import { TableProperties } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function RepertoireNavButton() {
  const isRepertoirePage = window.location.pathname.includes('repertoire')
  return (
    <NavLink
      data-testid='button-repertoire-nav'
      className={cn(
        'py-2 z-2 px-3 rounded-sm text-sm text-foreground relative flex items-center gap-1',
        'hover:no-underline',
        isRepertoirePage
          ? 'bg-primary/10'
          : 'bg-background50 hover:bg-background200/50',
      )}
      to='repertoire'
    >
      <TableProperties
        strokeWidth={isRepertoirePage ? 1.5 : 1}
        className={cn(
          'size-5',
          isRepertoirePage ? 'text-primary' : 'text-foreground',
        )}
      />
      <span
        className={cn(
          'translate-y-[1px] text-sm ',
          isRepertoirePage ? 'text-primary' : 'text-foreground',
        )}
      >
        Repertoire
      </span>
    </NavLink>
  )
}
