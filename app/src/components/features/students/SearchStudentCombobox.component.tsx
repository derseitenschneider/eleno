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
import { Search } from "lucide-react"
import { useState } from "react"
import { useStudents } from "../../../services/context/StudentContext"
import { sortStudents } from "../../../utils/sortStudents"

export default function SearchStudentCombobox() {
  const [open, setOpen] = useState(false)
  const { activeStudents, activeSortedStudentIds, setCurrentStudentIndex } =
    useStudents()
  const sortedActiveStudents = sortStudents(activeStudents, {
    sort: "lastName",
    ascending: "true",
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size='icon'
          role='combobox'
          aria-expanded={open}
          className='bg-background50 mr-5 shadow-md rounded-full hover:bg-background50 hover:translate-y-[-2px] transition-transform '
        >
          <Search className=' h-5 text-primary text-right' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0' side='bottom' align='start'>
        <Command>
          <CommandInput placeholder='Schüler:in suchen' />
          <CommandList>
            <CommandEmpty>Keine:n Schüler:in gefunden.</CommandEmpty>
            <CommandGroup>
              {sortedActiveStudents?.map((student) => (
                <CommandItem
                  key={student.id}
                  value={String(student.id)}
                  onSelect={() => {
                    setSelectedStudentId(student.value)
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
