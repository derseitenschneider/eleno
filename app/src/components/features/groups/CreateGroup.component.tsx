import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { GroupPartial, StudentPartial } from '@/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import StudentFormRow from './StudentFormRow.component'
import { useCreateGroup, useCreateStudents } from './useCreateGroup'

type CreateGroupsProps = {
  onSuccess: () => void
}
export type RowGroup = Omit<GroupPartial, 'user_id' | 'archive'> & {
  tempId?: number
}

export const groupValidationSchema = z.object({
  id: z.optional(z.number()).nullable(),
  name: z.string().min(2),
  students: z.array(z.string()).nullable(),
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
})

export type GroupSchema = z.infer<typeof groupValidationSchema>

const defaultGroup: GroupSchema = {
  name: '',
  students: [],
  startOfLesson: '',
  dayOfLesson: null,
  endOfLesson: '',
  durationMinutes: null,
  location: '',
}

export default function CreateGroup({ onSuccess }: CreateGroupsProps) {
  const { createGroup, isCreating } = useCreateGroup()
  const form = useForm<GroupSchema>({
    resolver: zodResolver(groupValidationSchema),
    defaultValues: defaultGroup,
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

  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: 'students',
  // })

  function onSubmit(data: { group: GroupSchema }) {
    createGroup(data.group, {
      onSuccess,
    })
  }

  return (
    <div className='w-[85vw]'>
      <div className={cn(grid)}>
        <span />
        <span className='text-sm pl-3 text-foreground/80'>Gruppenname*</span>
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
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className='flex items-center justify-between mt-4'>
            <div className='flex items-center'>
              <Input
                disabled={isCreating}
                className='w-[60px]'
                type='number'
                value={numAdd}
                onChange={(e) => setNumAdd(e.target.valueAsNumber)}
              />
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
