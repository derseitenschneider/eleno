import StudentFormRow from './StudentFormRow.component'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type StudentSchema,
  studentsValidationSchema,
} from './CreateStudents.component'
import { useQueryClient } from '@tanstack/react-query'
import type { Student } from '@/types/types'
import { cn } from '@/lib/utils'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useUpdateStudents } from './useUpdateStudents'
import MiniLoader from '@/components/ui/MiniLoader.component'

interface UpdateStudentsProps {
  onSuccess?: () => void
  studentIds: number[]
}

export default function UpdateStudents({
  onSuccess,
  studentIds,
}: UpdateStudentsProps) {
  const queryClient = useQueryClient()
  const { updateStudents, isUpdating } = useUpdateStudents()
  const students = queryClient.getQueryData(['students']) as
    | Array<Student>
    | undefined

  const studentsToUpdate = studentIds.map((id) =>
    students?.find((student) => student?.id === id),
  )

  const form = useForm<{ students: StudentSchema[] }>({
    resolver: zodResolver(studentsValidationSchema),
    defaultValues: { students: studentsToUpdate },
    mode: 'onSubmit',
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: false,
    },
    shouldFocusError: true,
  })

  const grid = 'grid gap-1 grid-cols-[20px_1fr_1fr_1fr_1fr_80px_80px_80px_1fr]'

  const { fields } = useFieldArray({
    control: form.control,
    name: 'students',
  })

  function onSubmit(data: { students: Array<StudentSchema> }) {
    const updatedStudents = studentsToUpdate.map((oldData) => {
      const newData = data.students.find(
        (student) => student.id === oldData?.id,
      )
      return { ...oldData, ...newData }
    }) as Array<Student>
    updateStudents(updatedStudents, {
      onSuccess,
    })
  }

  return (
    <div className='w-[85vw]'>
      <div className={cn(grid)}>
        <span />
        <span className='text-sm pl-3 text-foreground/80'>Vorname*</span>
        <span className='text-sm pl-3 text-foreground/80'>Nachname*</span>
        <span className='text-sm pl-3 text-foreground/80'>Instrument*</span>
        <span className='text-sm pl-3 text-foreground/80'>Tag</span>
        <span className='text-sm pl-3 text-foreground/80'>Von</span>
        <span className='text-sm pl-3 text-foreground/80'>Bis</span>
        <span className='text-sm pl-3 text-foreground/80'>Dauer</span>
        <span className='text-sm pl-3 text-foreground/80'>Unterrichtsort</span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='max-h-[75vh] overflow-auto no-scrollbar py-1'>
            {fields.map((field, i) => (
              <StudentFormRow
                key={field.id}
                grid={grid}
                index={i}
                form={form}
                disabled={isUpdating}
              />
            ))}
          </div>
          <div className='flex items-center justify-end gap-4 mt-4'>
            <Button
              size='sm'
              variant='outline'
              type='button'
              // onClick={onSuccess}
              onClick={() => console.log('test')}
              disabled={isUpdating}
            >
              Abbrechen
            </Button>
            <div className='flex items-center gap-2'>
              <Button size='sm' disabled={isUpdating} type='submit'>
                Speichern
              </Button>
              {isUpdating && <MiniLoader />}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
