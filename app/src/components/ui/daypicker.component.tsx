import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type DayPickerProps = {
  className?: string
  date?: Date
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  disabled?: boolean
}

export function DayPicker({
  className,
  date,
  setDate,
  disabled,
}: DayPickerProps) {
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
          {date ? format(date, "P") : null}
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
