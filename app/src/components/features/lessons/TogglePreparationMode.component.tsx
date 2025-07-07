import * as SwitchPrimitives from '@radix-ui/react-switch'
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
    <div className='flex flex-col items-end gap-1'>
      <span className='text-sm'>Lektionsvorbereitung:</span>
      {/* <span className={cn(!isPreparationMode && 'text-primary', 'text-sm')}> */}
      {/*   Unterrichten */}
      {/* </span> */}
      <SwitchPrimitives.Root
        className={cn(
          'peer inline-flex h-[25px] w-[42px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background200 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background50 data-[state=unchecked]:bg-background200',
        )}
        onCheckedChange={switchEntryMode}
        checked={isPreparationMode}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            isPreparationMode
              ? 'bg-primary text-white'
              : 'bg-background50 text-foreground',
            'p-[3px] pointer-events-none flex items-center justify-center  h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
          )}
        >
          {isPreparationMode ? (
            <CalendarClockIcon strokeWidth={1.5} />
          ) : (
            <BookTextIcon strokeWidth={1.5} />
          )}
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
      {/* <span className={cn(isPreparationMode && 'text-primary', 'text-sm')}> */}
      {/*   Vorbereiten */}
      {/* </span> */}
    </div>
  )
}
