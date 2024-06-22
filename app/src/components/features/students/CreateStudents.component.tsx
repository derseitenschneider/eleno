import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/services/context/UserContext"
import type { Student, StudentPartial } from "@/types/types"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import StudentFormRow from "./StudentFormRow.component"

type CreateStudentsProps = {
  onSuccess: () => void
}

const defaultStudent: StudentPartial = {
  firstName: "",
  lastName: "",
  archive: false,
  location: "",
  instrument: "",
  dayOfLesson: null,
  startOfLesson: "",
  endOfLesson: "",
  durationMinutes: null,
}
export default function CreateStudents({ onSuccess }: CreateStudentsProps) {
  const { user } = useUser()
  const [isError, setIsError] = useState(false)
  const [newStudents, setNewStudents] = useState<Array<Student>>()
  const [numStudents, setNumStudents] = useState(1)
  const [input, setInput] = useState(1)

  const arr = Array.from(Array(numStudents).keys())
  const grid =
    "grid gap-2 items-stretch grid-cols-[1fr_1fr_1fr_1fr_80px_80px_60px_1fr]"

  function handleSubmit() {}
  return (
    <div className='w-[90vw] pt-2 pl-1'>
      <div className={grid}>
        <span className='text-sm ml-3'>Vorname*</span>
        <span className='text-sm ml-3'>Nachname*</span>
        <span className='text-sm ml-3'>Instrument*</span>
        <span className='text-sm ml-3'>Tag</span>
        <span className='text-sm ml-3'>Von</span>
        <span className='text-sm ml-3'>Bis</span>
        <span className='text-sm ml-3'>Dauer</span>
        <span className='text-sm ml-3'>Unterrichtsort</span>
      </div>
      <div className='max-h-[75vh] w-full overflow-auto p-1'>
        {arr.map((el) => (
          <StudentFormRow
            grid={grid}
            key={el}
            setStudents={setNewStudents}
            setIsError={setIsError}
            indexStudent={el}
          />
        ))}
      </div>
      <div className='flex gap-4 items-center mt-4 justify-end'>
        <div className='mr-auto flex items-center'>
          <Input
            type='number'
            className='w-[60px]'
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
          <Button
            variant='ghost'
            size='sm'
            className='flex gap-1'
            onClick={() => {
              setNumStudents((prev) => prev + input)
              setInput(1)
            }}
          >
            <Plus className='size-4 text-primary' />
            <span>Zeilen hinzufügen</span>
          </Button>
        </div>
        <Button size='sm' variant='outline' onClick={onSuccess}>
          Abbrechen
        </Button>
        <Button size='sm' onClick={handleSubmit}>
          Speichern
        </Button>
      </div>
    </div>
  )
}
