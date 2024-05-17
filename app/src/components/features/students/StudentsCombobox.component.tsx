import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useStudents } from "@/services/context/StudentContext"
import { UsersRound } from "lucide-react"
import { useState } from "react"

export default function StudentsCombobox() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<number>()
  const { activeStudents } = useStudents()

  const students = activeStudents?.map((student) => ({
    value: student.id,
    label: `${student.firstName} ${student.lastName}`,
  }))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='border-none !bg-transparent justify-between'
        >
          {value ? (
            value
          ) : (
            <UsersRound
              strokeWidth={1.5}
              className=' h-5 text-primary text-right'
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0' side='bottom' align='start'>
        <Command>
          <CommandInput placeholder='Schüler:in suchen' />
          <CommandList>
            <CommandEmpty>Keine:n Schüler:in gefunden.</CommandEmpty>
            <CommandGroup>
              {students?.map((student) => (
                <CommandItem
                  key={student.value}
                  value={student.value}
                  onSelect={(value) => {
                    setValue(value)
                    setOpen(false)
                  }}
                >
                  <span>{student.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
