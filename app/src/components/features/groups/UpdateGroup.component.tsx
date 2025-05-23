import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ButtonRemove from '@/components/ui/buttonRemove'
import {
  type GroupSchema,
  groupValidationSchema,
} from './CreateGroup.component'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateGroup } from './useUpdateGroup'
import type { Group } from '@/types/types'
import { Label } from '@/components/ui/label'
import { useCallback } from 'react'
import { Blocker } from '../subscription/Blocker'
import { useSubscription } from '@/services/context/SubscriptionContext'

type UpdateGroupProps = {
  onSuccess?: () => void
  groupId: number
}

export default function UpdateGroup({ onSuccess, groupId }: UpdateGroupProps) {
  const { hasAccess } = useSubscription()
  const queryClient = useQueryClient()
  const { updateGroup, isUpdating } = useUpdateGroup()

  const groups = queryClient.getQueryData(['groups']) as Array<Group>
  const updatingGroup = groups.find((group) => group.id === groupId)

  const form = useForm<GroupSchema>({
    resolver: zodResolver(groupValidationSchema),
    defaultValues: updatingGroup,
    mode: 'onSubmit',
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: false,
    },
    shouldFocusError: true,
  })

  const grid =
    'grid gap-1 grid-cols-12 lg:grid-cols-[1fr_1fr_80px_80px_80px_1fr]'

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

  function onSubmit(group: GroupSchema) {
    const updatedGroup = {
      ...updatingGroup,
      ...group,
      students: group.students?.filter((student) => student.name) || null,
    } as Group

    updateGroup(updatedGroup, {
      onSuccess: () => onSuccess?.(),
    })
  }

  return (
    <div className='w-[85vw]'>
      <Blocker />
      <div className={cn(grid, 'hidden lg:grid')}>
        <span className='pl-3 text-sm text-foreground/80'>Gruppenname*</span>
        <span className='pl-3 text-sm text-foreground/80'>Tag</span>
        <span className='pl-3 text-sm text-foreground/80'>Von</span>
        <span className='pl-3 text-sm text-foreground/80'>Bis</span>
        <span className='pl-3 text-sm text-foreground/80'>Dauer</span>
        <span className='pl-3 text-sm text-foreground/80'>Unterrichtsort</span>
        <span />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={cn(grid, 'max-h-[75vh] gap-4 lg:gap-1')}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='col-span-6 space-y-0 lg:col-span-1'>
                  <Label className='inline lg:hidden' htmlFor={field.name}>
                    Gruppenname*
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Gruppenname'
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
                <FormItem className='col-span-6 space-y-0 lg:col-span-1'>
                  <Label className='inline lg:hidden' htmlFor={field.name}>
                    Tag
                  </Label>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
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
                <FormItem className='col-span-3 space-y-0 lg:col-span-1'>
                  <Label className='inline lg:hidden' htmlFor={field.name}>
                    Von
                  </Label>
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
                <FormItem className='col-span-3 space-y-0 lg:col-span-1'>
                  <Label className='inline lg:hidden' htmlFor={field.name}>
                    Bis
                  </Label>
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
                <FormItem className='col-span-6 space-y-0 lg:col-span-1'>
                  <Label className='inline lg:hidden' htmlFor={field.name}>
                    Dauer
                  </Label>
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
                <FormItem className='col-span-12 space-y-0 lg:col-span-1'>
                  <Label className='inline lg:hidden' htmlFor={field.name}>
                    Unterrichtsort
                  </Label>
                  <FormControl>
                    <Input
                      placeholder='Unterrichtsort'
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
              <p className='mb-2 font-medium'>
                {fields.length > 0 ? fields.length : ''} Schüler:innen
              </p>
            </div>
            <div className='grid grid-cols-5 gap-3'>
              {fields.map((field, index) => (
                <div key={field.id} className='relative'>
                  <FormField
                    control={form.control}
                    name={`students.${index}.name`}
                    render={({ field }) => (
                      <FormItem className=''>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Schüler:in ${index + 1}`}
                          />
                        </FormControl>
                        <ButtonRemove
                          className='absolute right-0 top-[25%] translate-x-[50%] translate-y-[-50%]'
                          onRemove={() => remove(index)}
                          tabIndex={-1}
                        />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                onClick={() => append({ name: '' })}
                type='button'
                size='sm'
                className={cn(
                  'w-fit self-center',
                  fields.length !== 0 && 'ml-3',
                )}
              >
                <Plus className='mr-1 size-4' />
                {fields.length === 0 ? 'Hinzufügen' : 'Mehr'}
              </Button>
            </div>
          </div>

          <div className='mt-4 flex items-center justify-end'>
            <div className='flex items-center gap-4'>
              <Button
                disabled={isUpdating}
                size='sm'
                variant='outline'
                type='button'
                onClick={onSuccess}
              >
                Abbrechen
              </Button>
              <div className='flex items-center gap-2'>
                <Button
                  disabled={isUpdating || !hasAccess}
                  size='sm'
                  type='submit'
                >
                  Speichern
                </Button>
                {isUpdating && <MiniLoader />}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
