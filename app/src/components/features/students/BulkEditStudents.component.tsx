import { Button } from "@/components/ui/button"
import { Student } from "@/types/types"
import { useState } from "react"
import StudentFormRow from "./StudentFormRow.component"
import { useUpdateStudents } from "./useUpdateStudents"

type BulkEditStudentsProps = {
  students: Array<Student>
  onSuccess: () => void
}
export default function BulkEditStudents({
  students,
  onSuccess,
}: BulkEditStudentsProps) {
  const [editedStudents, setEditedStudents] = useState<Array<Student>>(students)
  const [isError, setIsError] = useState(false)
  const { updateStudents, isUpdating, isSuccess } = useUpdateStudents()

  function handleSubmit() {
    updateStudents(editedStudents)
    onSuccess()
  }
  const grid =
    "grid gap-2 items-stretch grid-cols-[1fr_1fr_1fr_1fr_80px_80px_60px_1fr]"
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
        {students.map((student) => (
          <StudentFormRow
            grid={grid}
            key={student.id}
            setStudents={setEditedStudents}
            student={student}
            setIsError={setIsError}
          />
        ))}
      </div>
      <div className='flex gap-4 items-center mt-4 justify-end'>
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
