import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import ButtonRemove from '@/components/ui/buttonRemove'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { cn } from '@/lib/utils'
import {
  groupValidationSchema,
  type GroupSchema,
} from '../groups/CreateGroup.component'
import useStudentsQuery from './studentsQueries'
import { useCreateGroup } from '../groups/useCreateGroup'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useConvertStudentToGroup } from './useConvertStudentToGroup'
import { toast } from 'sonner'
import { useCallback } from 'react'

type ConvertStudentToGroupProps = {
  studentId: number
  onSuccess: () => void
}

export default function ConvertStudentToGroup({
  studentId,
  onSuccess,
}: ConvertStudentToGroupProps) {
  const students = useStudentsQuery().data
  const student = students?.find((student) => student.id === studentId)
  const { convertToGroup, isConverting } = useConvertStudentToGroup()

  const defaultValues: GroupSchema = {
    name: '',
    students: [{ name: '' }, { name: '' }, { name: '' }],
    dayOfLesson: student?.dayOfLesson as GroupSchema['dayOfLesson'],
    startOfLesson: student?.startOfLesson || null,
    endOfLesson: student?.endOfLesson || null,
    durationMinutes: student?.durationMinutes || null,
    location: student?.location || null,
  }

  const form = useForm<GroupSchema>({
    resolver: zodResolver(groupValidationSchema),
    defaultValues,
    mode: 'onSubmit',
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'students',
  })

  const calculateDuration = useCallback(() => {
    const startTime = form.getValues('startOfLesson')
    const endTime = form.getValues('endOfLesson')
    if (!startTime || !endTime) return
    const startDate = new Date(`1970-01-01T${startTime}:00`)
    const endDate = new Date(`1970-01-01T${endTime}:00`)
    const durationMs = endDate.getTime() - startDate.getTime()
    form.setValue('durationMinutes', Math.round(durationMs / 60_000))
  }, [form.setValue, form.getValues])

  async function onSubmit(group: GroupSchema) {
    if (!student) return
    const groupData = {
      ...group,
      students: group.students?.filter((student) => student.name) || [],
    }

    convertToGroup(
      { student, groupData },
      {
        onSuccess: () => {
          toast.success('Umwandlung erfolgreich.')
          onSuccess()
        },
      },
    )
  }

  const grid = 'grid gap-1 grid-cols-[1fr_1fr_80px_80px_80px_1fr]'

  return (
    <div className='w-[85vw]'>
      <DialogHeader>
        <DialogTitle>
          {student?.firstName} {student?.lastName} in Gruppe umwandeln
        </DialogTitle>
      </DialogHeader>
      <p className='mb-6'>
        Nach der Umwandlung hast du eine neue Gruppe statt eines Einzelschülers.
        Alle bisherigen Informationen und Einträge bleiben erhalten, sind aber
        nun der Gruppe zugeordnet. Du kannst jederzeit weitere Schüler zur
        Gruppe hinzufügen. Beachte: Diese Änderung kann nicht rückgängig gemacht
        werden.
      </p>
      <div className={cn(grid)}>
        <span className='text-sm pl-3 text-foreground/80'>Gruppenname*</span>
        <span className='text-sm pl-3 text-foreground/80'>Tag</span>
        <span className='text-sm pl-3 text-foreground/80'>Von</span>
        <span className='text-sm pl-3 text-foreground/80'>Bis</span>
        <span className='text-sm pl-3 text-foreground/80'>Dauer</span>
        <span className='text-sm pl-3 text-foreground/80'>Unterrichtsort</span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={cn(grid, 'max-h-[75vh]')}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Group Name'
                      className={cn(
                        form.formState.errors.name && 'border-warning',
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='dayOfLesson'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ''}
                    >
                      <SelectTrigger className='h-[36px]'>
                        <SelectValue placeholder='Unterrichtstag' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Montag'>Montag</SelectItem>
                        <SelectItem value='Dienstag'>Dienstag</SelectItem>
                        <SelectItem value='Mittwoch'>Mittwoch</SelectItem>
                        <SelectItem value='Donnerstag'>Donnerstag</SelectItem>
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
              name='startOfLesson'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='time'
                      {...field}
                      onBlur={() => {
                        field.onBlur()
                        calculateDuration()
                      }}
                      value={form.getValues('startOfLesson') || ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='endOfLesson'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='time'
                      {...field}
                      onBlur={() => {
                        field.onBlur()
                        calculateDuration()
                      }}
                      value={form.getValues('endOfLesson') || ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='durationMinutes'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        placeholder='45 Min.'
                        type='number'
                        {...field}
                        value={form.getValues('durationMinutes') || ''}
                        className={cn(
                          field.value ? 'pr-11' : '',
                          'text-right ',
                        )}
                      />
                      <span
                        className={cn(
                          field.value ? 'inline' : 'hidden',
                          'absolute top-[50%] translate-y-[calc(-50%+1px)] right-3 pointer-events-none',
                        )}
                      >
                        Min.
                      </span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Location'
                      {...field}
                      value={form.getValues('location') || ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className='mt-8'>
            <div className='flex items-center gap-5'>
              <p className='font-medium mb-2'>Schüler:innen</p>
            </div>
            <div className='grid gap-3 grid-cols-5'>
              {fields.map((field, index) => (
                <div key={field.id} className='relative'>
                  <FormField
                    control={form.control}
                    name={`students.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Schüler:in ${index + 1}`}
                          />
                        </FormControl>
                        {index !== 0 && (
                          <ButtonRemove
                            className='absolute right-0 translate-x-[50%] top-[25%] translate-y-[-50%]'
                            onRemove={() => remove(index)}
                            tabIndex={-1}
                          />
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                onClick={() => append({ name: '' })}
                type='button'
                size='sm'
                className='w-fit ml-3 self-center'
              >
                <Plus className='mr-1 size-4' />
                Mehr
              </Button>
            </div>
          </div>

          <div className='flex items-center justify-end mt-4'>
            <div className='flex items-center gap-4'>
              <Button
                disabled={isConverting}
                size='sm'
                variant='outline'
                type='button'
                onClick={onSuccess}
              >
                Abbrechen
              </Button>
              <div className='flex items-center gap-2'>
                <Button disabled={isConverting} size='sm' type='submit'>
                  Speichern
                </Button>
                {isConverting && <MiniLoader />}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
