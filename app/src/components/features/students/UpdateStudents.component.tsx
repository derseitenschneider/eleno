import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Student } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useFieldArray, useForm, FormProvider, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import StudentFormRow from './StudentFormRow.component'
import MiniLoader from '@/components/ui/MiniLoader.component'
import {
  type StudentSchema,
  studentsValidationSchema,
} from './CreateStudents.component'
import { useUpdateStudents } from './useUpdateStudents'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Blocker } from '../subscription/Blocker'
import { useSubscription } from '@/services/context/SubscriptionContext'

const MemoizedStudentFormRow = React.memo(StudentFormRow)

interface UpdateStudentsProps {
  onSuccess?: () => void
  studentIds: number[]
}

export default function UpdateStudents({
  onSuccess,
  studentIds,
}: UpdateStudentsProps) {
  const { hasAccess } = useSubscription()
  const queryClient = useQueryClient()
  const { updateStudents, isUpdating } = useUpdateStudents()

  const students = queryClient.getQueryData(['students']) as
    | Array<Student>
    | undefined

  const studentsToUpdate = useMemo(
    () =>
      studentIds.map((id) => students?.find((student) => student?.id === id)),
    [studentIds, students],
  )

  const methods = useForm<{ students: StudentSchema[] }>({
    resolver: zodResolver(studentsValidationSchema),
    defaultValues: { students: studentsToUpdate },
    mode: 'onSubmit',
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: false,
    },
    shouldFocusError: true,
  })

  const { control, setValue, getValues } = methods

  const { fields } = useFieldArray({
    control: methods.control,
    name: 'students',
  })
  const watchedStudents = useWatch({
    control,
    name: 'students',
  })

  const calculateDuration = useCallback((start: string, end: string) => {
    if (!start || !end) return null
    const startDate = new Date(`1970-01-01T${start}:00`)
    const endDate = new Date(`1970-01-01T${end}:00`)
    const durationMs = endDate.getTime() - startDate.getTime()
    return Math.round(durationMs / 60000)
  }, [])

  useEffect(() => {
    watchedStudents.forEach((student, index) => {
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
  }, [watchedStudents, calculateDuration, setValue, getValues])

  const grid = useMemo(
    () =>
      'grid gap-1 grid-cols-12 lg:grid-cols-[20px_1fr_1fr_1fr_1fr_80px_80px_80px_1fr] pr-1',
    [],
  )

  const onSubmit = useCallback(
    (data: { students: Array<StudentSchema> }) => {
      const updatedStudents = studentsToUpdate.map((oldData) => {
        const newData = data.students.find(
          (student) => student.id === oldData?.id,
        )
        return { ...oldData, ...newData }
      }) as Array<Student>
      updateStudents(updatedStudents, {
        onSuccess,
      })
    },
    [studentsToUpdate, updateStudents, onSuccess],
  )

  return (
    <div
      className={cn(
        !hasAccess && 'h-[200px]',
        'relative w-[90vw] lg:w-[85vw] lg:min-w-[950px]',
      )}
    >
      <Blocker />
      <div className='flex h-full flex-col overflow-hidden'>
        <div className={cn(grid, 'hidden lg:grid')}>
          <span />
          <span className='pl-3 text-sm text-foreground/80'>Vorname*</span>
          <span className='pl-3 text-sm text-foreground/80'>Nachname*</span>
          <span className='pl-3 text-sm text-foreground/80'>Instrument*</span>
          <span className='pl-3 text-sm text-foreground/80'>Tag</span>
          <span className='pl-3 text-sm text-foreground/80'>Von</span>
          <span className='pl-3 text-sm text-foreground/80'>Bis</span>
          <span className='pl-3 text-sm text-foreground/80'>Dauer</span>
          <span className='pl-3 text-sm text-foreground/80'>
            Unterrichtsort
          </span>
        </div>
        <FormProvider {...methods}>
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <ScrollArea className='flex max-h-[75vh] flex-col !overflow-hidden'>
                {fields.map((field, index, arr) => (
                  <MemoizedStudentFormRow
                    fields={arr.length}
                    key={field.id}
                    grid={grid}
                    index={index}
                    disabled={isUpdating}
                  />
                ))}
              </ScrollArea>
              <div className='flex items-end justify-between pb-1 pr-1'>
                <span className='text-sm'>* Pflichtfelder</span>
                <div className='mt-4 flex items-center justify-end gap-4'>
                  <Button
                    size='sm'
                    variant='outline'
                    type='button'
                    onClick={onSuccess}
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
              </div>
            </form>
          </Form>
        </FormProvider>
      </div>
    </div>
  )
}
