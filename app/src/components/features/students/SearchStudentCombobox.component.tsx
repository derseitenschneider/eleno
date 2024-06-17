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
import { useNavigate, useParams } from "react-router-dom"
import { useStudents } from "../../../services/context/StudentContext"
import { sortStudents } from "../../../utils/sortStudents"

export default function SearchStudentCombobox() {
  const { studentId: currentStudentId } = useParams()
  const [open, setOpen] = useState(false)
  const { activeStudents, activeSortedStudentIds, setCurrentStudentIndex } =
    useStudents()
  const navigate = useNavigate()

  if (!activeStudents) return null
  const sortedActiveStudents = sortStudents(activeStudents, {
    sort: "lastName",
    ascending: true,
  })

  function handleSelect(newStudentId: number) {
    const newStudentIndex = activeSortedStudentIds.indexOf(newStudentId || 0)
    setCurrentStudentIndex(newStudentIndex)
    const url = window.location.pathname
    const newUrl = url.replace(String(currentStudentId), String(newStudentId))
    navigate(newUrl)
    setOpen(false)
  }

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
          <CommandList>
            <CommandEmpty>Keine:n Schüler:in gefunden.</CommandEmpty>
            <CommandGroup>
              {sortedActiveStudents?.map((student) => (
                <CommandItem
                  key={student.id}
                  value={`${student.firstName} ${student.lastName}`}
                  onSelect={() => handleSelect(student.id)}
                >
                  <span>{`${student.firstName} ${student.lastName}`}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandInput placeholder='Schüler:in suchen' />
        </Command>
      </PopoverContent>
    </Popover>
  )
}
