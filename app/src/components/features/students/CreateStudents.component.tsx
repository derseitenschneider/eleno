import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { StudentPartial } from '@/types/types'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useCreateStudents } from './useCreateStudents'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import StudentFormRow from './StudentFormRow.component'
import MiniLoader from '@/components/ui/MiniLoader.component'

type CreateStudentsProps = {
  onSuccess: () => void
}
export type RowStudent = Omit<StudentPartial, 'user_id' | 'archive'> & {
  tempId?: number
}

export const studentsValidationSchema = z.object({
  students: z.array(
    z.object({
      id: z.optional(z.number()).nullable(),
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      instrument: z.string().min(2),
      dayOfLesson: z
        .optional(
          z
            .union([
              z.literal('Montag'),
              z.literal('Dienstag'),
              z.literal('Mittwoch'),
              z.literal('Donnerstag'),
              z.literal('Freitag'),
              z.literal('Samstag'),
              z.literal('Sonntag'),
              z.literal('none'),
            ])
            .nullable()
            .transform((val) => (val === 'none' ? null : val)),
        )
        .transform((val) => (val === undefined ? null : val)),
      startOfLesson: z
        .optional(z.string())
        .transform((val) => (val === '' || val === undefined ? null : val))
        .nullable(),
      endOfLesson: z
        .optional(z.string())
        .transform((val) => (val === '' || val === undefined ? null : val))
        .nullable(),
      durationMinutes: z
        .optional(z.coerce.number().min(0, { message: 'Ungültiger Wert.' }))
        .transform((val) => (val === undefined ? null : val))
        .nullable(),
      location: z
        .optional(z.string())
        .transform((val) => (val === undefined ? null : val))
        .nullable(),
    }),
  ),
})

export type StudentSchema = z.infer<
  typeof studentsValidationSchema
>['students'][number]

const defaultStudent: StudentSchema = {
  firstName: '',
  lastName: '',
  instrument: '',
  startOfLesson: '',
  dayOfLesson: null,
  endOfLesson: '',
  durationMinutes: null,
  location: '',
}

export default function CreateStudents({ onSuccess }: CreateStudentsProps) {
  const { createStudents, isCreating } = useCreateStudents()
  const form = useForm<{ students: StudentSchema[] }>({
    resolver: zodResolver(studentsValidationSchema),
    defaultValues: { students: [defaultStudent] },
    mode: 'onSubmit',
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: false,
    },
    shouldFocusError: true,
  })

  const [numAdd, setNumAdd] = useState(1)

  const grid =
    'grid gap-4 sm:gap-1 sm:grid-cols-[20px_1fr_1fr_1fr_1fr_80px_80px_80px_1fr_24px]'

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'students',
  })

  function appendStudents() {
    const newStudents = Array.from(Array(numAdd)).map(() => defaultStudent)
    append(newStudents)
    setNumAdd(1)
  }

  function onSubmit(data: { students: Array<StudentSchema> }) {
    createStudents(data.students, {
      onSuccess,
    })
  }

  return (
    <div className='sm:w-[85vw]'>
      <div className={cn(grid, 'hidden sm:grid')}>
        <span />
        <span className='text-sm pl-3 text-foreground/80'>Vorname*</span>
        <span className='text-sm pl-3 text-foreground/80'>Nachname*</span>
        <span className='text-sm pl-3 text-foreground/80'>Instrument*</span>
        <span className='text-sm pl-3 text-foreground/80'>Tag</span>
        <span className='text-sm pl-3 text-foreground/80'>Von</span>
        <span className='text-sm pl-3 text-foreground/80'>Bis</span>
        <span className='text-sm pl-3 text-foreground/80'>Dauer</span>
        <span className='text-sm pl-3 text-foreground/80'>Unterrichtsort</span>
        <span />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='sm:max-h-[75vh] sm:overflow-auto no-scrollbar sm:py-1'>
            {fields.map((field, i) => (
              <StudentFormRow
                key={field.id}
                grid={grid}
                remove={remove}
                index={i}
                form={form}
                disabled={isCreating}
              />
            ))}
          </div>
          <div className='flex items-center justify-between mt-4'>
            <div className='flex items-center'>
              <Input
                disabled={isCreating}
                className='w-[60px] hidden sm:block'
                type='number'
                value={numAdd}
                onChange={(e) => setNumAdd(e.target.valueAsNumber)}
              />
              <Button
                disabled={isCreating}
                className='hidden sm:flex'
                type='button'
                variant='ghost'
                size='sm'
                onClick={appendStudents}
              >
                <Plus className='size-4 text-primary' />
              </Button>
            </div>
            <div className='flex items-center gap-4'>
              <Button
                disabled={isCreating}
                size='sm'
                variant='outline'
                type='button'
                onClick={onSuccess}
              >
                Abbrechen
              </Button>
              <div className='flex items-center gap-2'>
                <Button disabled={isCreating} size='sm' type='submit'>
                  Speichern
                </Button>
                {isCreating && <MiniLoader />}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
