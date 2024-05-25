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

export default function AddStudentCombobox({
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

  const selectedStudent = activeStudents?.find(
    (student) => student.id === selectedStudentId,
  )
  function handleSelect(e: string) {
    const firstName = e.split(" ")[0]
    const lastName = e.split(" ")[1]
    const newStudentId = activeStudents?.find(
      (student) =>
        student.firstName === firstName && student.lastName === lastName,
    )?.id
    setSelectedStudentId(newStudentId)
    setOpen(false)
  }

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
            {selectedStudent ? (
              <div>
                <Badge>{`${selectedStudent.firstName} ${selectedStudent.lastName}`}</Badge>
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
                {activeStudents?.map((student) => (
                  <CommandItem
                    key={student.id}
                    value={`${student.firstName} ${student.lastName}`}
                    onSelect={handleSelect}
                  >
                    <span>{`${student.firstName} ${student.lastName}`}</span>
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
          onRemove={() => setSelectedStudentId(undefined)}
        />
      )}
    </div>
  )
}
