import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ButtonRemove from "@/components/ui/buttonRemove/ButtonRemove"
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
import { useEffect, useState } from "react"

export default function StudentsCombobox({
  studentId,
  disabled,
}: { studentId?: number; disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<
    number | undefined
  >(studentId)
  const { activeStudents } = useStudents()

  useEffect(() => {
    studentId && setSelectedStudentId(studentId)
  }, [studentId])

  const studentsSelect = activeStudents?.map((student) => ({
    value: student.id,
    label: `${student.firstName} ${student.lastName}`,
  }))

  const selectedStudent = studentsSelect?.find(
    (student) => student.value === selectedStudentId,
  )
  return (
    <div className='flex items-center'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='border-none !bg-transparent justify-between'
          >
            {selectedStudentId ? (
              <div>
                <Badge>{selectedStudent?.label}</Badge>
              </div>
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
                {studentsSelect?.map((student) => (
                  <CommandItem
                    key={String(student.value)}
                    value={String(student.value)}
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
      {selectedStudentId && (
        <ButtonRemove
          className='translate-x-[-12px]'
          onRemove={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  )
}
