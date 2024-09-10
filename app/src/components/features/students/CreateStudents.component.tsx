import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { StudentPartial } from '@/types/types'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCreateStudents } from './useCreateStudents'
import { z } from 'zod'
import { useFieldArray, useForm, FormProvider, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import StudentFormRow from './StudentFormRow.component'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { memo } from 'react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const MemoizedStudentFormRow = memo(StudentFormRow)

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
  const methods = useForm<{ students: StudentSchema[] }>({
    resolver: zodResolver(studentsValidationSchema),
    defaultValues: { students: [defaultStudent] },
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: false,
    },
    shouldFocusError: true,
  })

  const { control, setValue, getValues } = methods

  const students = useWatch({ control, name: 'students' })

  const calculateDuration = useCallback((start: string, end: string) => {
    if (!start || !end) return null
    const startDate = new Date(`1970-01-01T${start}:00`)
    const endDate = new Date(`1970-01-01T${end}:00`)
    const durationMs = endDate.getTime() - startDate.getTime()
    return Math.round(durationMs / 60000)
  }, [])

  useEffect(() => {
    students.forEach((student, index) => {
      const { startOfLesson, endOfLesson, durationMinutes } = student
      const calculatedDuration = calculateDuration(
        startOfLesson || '',
        endOfLesson || '',
      )

      if (
        calculatedDuration !== null &&
        calculatedDuration !== durationMinutes
      ) {
        const currentValue = getValues(`students.${index}.durationMinutes`)
        if (currentValue === null || currentValue === undefined) {
          setValue(`students.${index}.durationMinutes`, calculatedDuration)
        }
      }
    })
  }, [students, calculateDuration, setValue, getValues])
  const [numAdd, setNumAdd] = useState(1)

  const grid = useMemo(
    () =>
      'grid gap-1 grid-cols-12 lg:grid-cols-[20px_1fr_1fr_1fr_1fr_80px_80px_80px_1fr_24px]',
    [],
  )

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'students',
  })

  const appendStudents = useCallback(() => {
    const newStudents = Array.from(Array(numAdd)).map(() => defaultStudent)
    append(newStudents)
    setNumAdd(1)
  }, [append, numAdd])

  const onSubmit = useCallback(
    (data: { students: Array<StudentSchema> }) => {
      createStudents(data.students, { onSuccess })
    },
    [createStudents, onSuccess],
  )

  const memoizedStudentRows = useMemo(
    () =>
      fields.map((field, index, arr) => (
        <MemoizedStudentFormRow
          autoFocus={index === 0}
          fields={arr.length}
          key={field.id}
          grid={grid}
          remove={remove}
          index={index}
          disabled={isCreating}
        />
      )),
    [fields, remove, isCreating, grid],
  )

  return (
    <div className='md:w-[90vw]'>
      <div className={cn(grid, 'hidden lg:grid ')}>
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
      <FormProvider {...methods}>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <ScrollArea className='flex max-h-[75vh] flex-col !overflow-hidden'>
              {memoizedStudentRows}
            </ScrollArea>
            <div className='flex items-center justify-between mt-4'>
              <div className='flex items-center'>
                <Input
                  disabled={isCreating}
                  className='w-[7ch]'
                  type='number'
                  value={numAdd}
                  onChange={(e) => setNumAdd(e.target.valueAsNumber)}
                />
                <Button
                  disabled={isCreating}
                  className='p-0 ml-2'
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={appendStudents}
                >
                  <Plus className='size-4 text-primary' />
                  <span>Mehr</span>
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
      </FormProvider>
    </div>
  )
}
