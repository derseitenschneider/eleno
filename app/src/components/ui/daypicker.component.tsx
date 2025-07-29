import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useState } from 'react'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'

type DayPickerProps = {
  className?: string
  date?: Date
  setDate: (date: Date | undefined) => void
  disabled?: boolean
}

export function DayPicker({
  className,
  date,
  setDate,
  disabled,
}: DayPickerProps) {
  const { userLocale } = useUserLocale()
  const isMobile = useIsMobileDevice()

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          size='sm'
          variant={'outline'}
          onClick={() => setIsCalendarOpen((prev) => !prev)}
          className={cn(
            'w-auto gap-2 justify-start text-left text-foreground font-normal border-hairline',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className={cn('h-4 w-4 text-primary')} />
          {date ? (
            <span>
              {date.toLocaleDateString(userLocale, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto border-hairline p-0'>
        <Calendar
          onDayClick={() => setIsCalendarOpen(false)}
          mode='single'
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
