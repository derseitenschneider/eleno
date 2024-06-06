import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useUserLocale } from "@/services/context/UserLocaleContext"

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          size='sm'
          variant={"outline"}
          className={cn(
            "w-auto gap-2 justify-start text-left text-foreground font-normal border-hairline",
            !date && "text-muted-foreground",
            className,
          )}
        >
          {!date && <CalendarIcon className='h-4 w-4 text-primary' />}
          {/* {date ? format(date, "P") : null} */}
          {date
            ? date.toLocaleDateString(userLocale, {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0 border-hairline'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
