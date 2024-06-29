import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Student, StudentPartial } from '@/types/types'
import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCreateStudents } from './useCreateStudents'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { useUser } from '@/services/context/UserContext'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

type CreateStudentsProps = {
  onSuccess: () => void
}
export type RowStudent = Omit<StudentPartial, 'user_id' | 'archive'> & {
  tempId?: number
}

const validationSchema = z.object({
  students: z.array(
    z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      instrument: z.string().min(2),
      dayOfLesson: z.optional(
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
          .transform((val) => (val === 'none' ? '' : val)),
      ),
      // .nullable(),
      startOfLesson: z.optional(z.string()),
      // .transform((val) => (val === '' || !val ? null : val))
      // .nullable(),
      endOfLesson: z.optional(z.string()),
      // .transform((val) => (val === '' || !val ? null : val))
      // .nullable(),
      durationMinutes: z.optional(
        z.coerce.number().min(0, { message: 'Ungültiger Wert.' }),
      ),
      // .transform((val) => (val === 0 || !val ? null : val))
      // .nullable(),
      location: z.optional(z.string()),
      // .transform((val) => (val === '' || !val ? null : val))
      // .nullable(),
    }),
  ),
})

type StudentSchema = z.infer<typeof validationSchema>['students'][number]

const defaultStudent: StudentSchema = {
  firstName: '',
  lastName: '',
  instrument: '',
}

export default function CreateStudents({ onSuccess }: CreateStudentsProps) {
  const { createStudents, isCreating } = useCreateStudents()
  const form = useForm<{ students: StudentSchema[] }>({
    resolver: zodResolver(validationSchema),
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
    'grid gap-1 grid-cols-[20px_1fr_1fr_1fr_1fr_80px_80px_80px_1fr_24px]'
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'students',
  })

  function appendStudents() {
    const newStudents = Array.from(Array(numAdd)).map(() => defaultStudent)
    append(newStudents)
    setNumAdd(1)
  }

  function onSubmit({ students }) {
    createStudents(students, {
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
        <span />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='max-h-[75vh] overflow-auto no-scrollbar py-1'>
            {fields.map((field, i) => (
              <div className={cn(grid)} key={field.id}>
                <span className='self-center text-sm text-foreground/75'>
                  {i + 1}
                </span>
                <FormField
                  control={form.control}
                  name={`students.${i}.firstName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Vorname'
                          {...field}
                          className={cn(
                            form.formState.errors.students?.[i]?.firstName &&
                              'border-warning',
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`students.${i}.lastName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Nachname'
                          {...field}
                          className={cn(
                            form.formState.errors.students?.[i]?.lastName &&
                              'border-warning',
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`students.${i}.instrument`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Instrument'
                          {...field}
                          className={cn(
                            form.formState.errors.students?.[i]?.instrument &&
                              'border-warning',
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`students.${i}.dayOfLesson`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className='h-[36px]'>
                            <SelectValue placeholder='Unterrichtstag' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Montag'>Montag</SelectItem>
                            <SelectItem value='Dienstag'>Dienstag</SelectItem>
                            <SelectItem value='Mittwoch'>Mittwoch</SelectItem>
                            <SelectItem value='Donnerstag'>
                              Donnerstag
                            </SelectItem>
                            <SelectItem value='Freitag'>Freitag</SelectItem>
                            <SelectItem value='Samstag'>Samstag</SelectItem>
                            <SelectItem value='Sonntag'>Sonntag</SelectItem>
                            <SelectItem value='none'>–</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`students.${i}.startOfLesson`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='time'
                          {...field}
                          className={cn(
                            form.formState.errors.students?.[i]
                              ?.startOfLesson && 'border-warning',
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`students.${i}.endOfLesson`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='time'
                          {...field}
                          className={cn(
                            form.formState.errors.students?.[i]?.endOfLesson &&
                              'border-warning',
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`students.${i}.durationMinutes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='45'
                          type='number'
                          {...field}
                          className={cn(
                            form.formState.errors.students?.[i]
                              ?.durationMinutes && 'border-warning',
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`students.${i}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Unterrichtsort'
                          {...field}
                          className={cn(
                            form.formState.errors.students?.[i]?.location &&
                              'border-warning',
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type='button'
                  variant='ghost'
                  className={cn(i === 0 && 'hidden', 'p-0')}
                  onClick={() => remove(i)}
                  tabIndex={-1}
                  disabled={i === 0}
                >
                  <Trash2 strokeWidth={1.5} className='size-4 text-warning' />
                </Button>
              </div>
            ))}
          </div>
          <div className='flex items-center justify-between mt-4'>
            <div className='flex items-center'>
              <Input
                className='w-[60px]'
                type='number'
                value={numAdd}
                onChange={(e) => setNumAdd(e.target.valueAsNumber)}
              />
              <Button
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
                size='sm'
                variant='outline'
                type='button'
                onClick={onSuccess}
              >
                Abbrechen
              </Button>
              <Button size='sm' type='submit'>
                Speichern
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
