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

type ConvertStudentToGroupProps = {
  studentId: number
  onSuccess: () => void
  onCancel: () => void
}

export default function ConvertStudentToGroup({
  studentId,
  onSuccess,
  onCancel,
}: ConvertStudentToGroupProps) {
  const students = useStudentsQuery().data
  const student = students?.find((student) => student.id === studentId)
  const { createGroup, isCreating } = useCreateGroup()

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

  async function onSubmit(group: GroupSchema) {
    const groupData = {
      ...group,
      students: group.students?.filter((student) => student.name) || null,
    }

    createGroup(groupData, {
      onSuccess: (newGroup) => {
        console.log(newGroup)
      },
    })
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
                      defaultValue={field.value || undefined}
                    >
                      <SelectTrigger className='h-[36px]'>
                        <SelectValue placeholder='Lesson Day' />
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
                    <Input
                      placeholder='45'
                      type='number'
                      {...field}
                      value={form.getValues('durationMinutes') || ''}
                    />
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
                disabled={isCreating}
                size='sm'
                variant='outline'
                type='button'
                onClick={onCancel}
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
