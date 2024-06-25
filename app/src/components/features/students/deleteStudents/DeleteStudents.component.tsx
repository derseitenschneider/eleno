import { useQueryClient } from "@tanstack/react-query"
import type { Student } from "@/types/types"
import { Button } from "@/components/ui/button"
import { useDeleteStudents } from "../useDeleteStudents"

interface DeleteStudentsProps {
  onSuccess: () => void
  studentIds: number[]
}

function DeleteStudents({ onSuccess, studentIds }: DeleteStudentsProps) {
  const { deleteStudents, isDeleting, isError } = useDeleteStudents()
  const queryClient = useQueryClient()

  const students = queryClient.getQueryData(["students"]) as
    | Array<Student>
    | undefined

  const studentsToDelete = studentIds.map((id) =>
    students?.find((student) => student.id === id),
  )

  function handleDeleteStudents() {
    deleteStudents(studentIds, {
      onSuccess,
    })
  }
  return (
    <div>
      {studentsToDelete.length === 1 ? (
        <p>
          Möchtest du{" "}
          <span className='font-semibold text-primary'>
            {studentsToDelete[0]?.firstName} {studentsToDelete[0]?.lastName}
          </span>{" "}
          und alle zugehörigen Daten endgültig löschen?
        </p>
      ) : (
        <p>
          Möchtest du die ausgewählten Schüler:innen und alle zugehörigen Daten
          endgültig löschen?
        </p>
      )}

      <div className='flex justify-end gap-4 mt-4'>
        <Button size='sm' variant='outline' onClick={onSuccess}>
          Abbrechen
        </Button>
        <Button size='sm' variant='destructive' onClick={handleDeleteStudents}>
          Löschen
        </Button>
      </div>
    </div>
  )
}

export default DeleteStudents
