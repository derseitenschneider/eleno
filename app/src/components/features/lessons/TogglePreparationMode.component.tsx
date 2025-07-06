import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BookTextIcon, CalendarClockIcon } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useCurrentHolder from './useCurrentHolder'

export function TogglePreparationMode() {
  const navigate = useNavigate()
  const { currentLessonHolder } = useCurrentHolder()
  const [searchParams, setSearchParams] = useSearchParams()

  if (!currentLessonHolder) return null
  const { type, holder } = currentLessonHolder

  const isPreparationMode = searchParams.get('mode') === 'preparation'

  function switchEntryMode() {
    const path = window.location.pathname
    if (path.includes('repertoire') || path.includes('all')) {
      navigate(`/lessons/${type}-${holder.id}`)
      searchParams.set('mode', 'preparation')
      return setSearchParams(searchParams)
    }
    const mode = searchParams.get('mode')
    if (mode === 'preparation') {
      searchParams.delete('mode')
    } else {
      searchParams.set('mode', 'preparation')
    }

    setSearchParams(searchParams)
  }
  return (
    <Button
      className={cn(
        'font-normal py-2 z-2 px-3 rounded-sm text-sm text-foreground relative flex items-center gap-1',
        'hover:no-underline',
        isPreparationMode
          ? 'bg-primary/10 hover:bg-primary/10'
          : 'bg-background50 hover:bg-background200/50',
      )}
      onClick={switchEntryMode}
    >
      {isPreparationMode ? (
        <>
          <BookTextIcon
            strokeWidth={isPreparationMode ? 1.5 : 1}
            className={cn(
              'size-5',
              isPreparationMode ? 'text-primary' : 'text-foreground',
            )}
          />
          <span
            className={cn(
              'translate-y-[1px] text-sm ',
              isPreparationMode ? 'text-primary' : 'text-foreground',
            )}
          >
            Unterricht dokumentieren
          </span>
        </>
      ) : (
        <>
          <CalendarClockIcon
            strokeWidth={isPreparationMode ? 1.5 : 1}
            className={cn(
              'size-5',
              isPreparationMode ? 'text-primary' : 'text-foreground',
            )}
          />
          <span
            className={cn(
              'translate-y-[1px] text-sm ',
              isPreparationMode ? 'text-primary' : 'text-foreground',
            )}
          >
            Lektion vorbereiten
          </span>
        </>
      )}
    </Button>
  )
}
