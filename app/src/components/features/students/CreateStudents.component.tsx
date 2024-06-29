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
    z.object({ firstName: z.string().min(2), lastName: z.string() }),
  ),
})

type StudentSchema = z.infer<typeof validationSchema>['students'][number]

const defaultStudent: StudentSchema = {
  firstName: '',
  lastName: '',
}

export default function CreateStudents({ onSuccess }: CreateStudentsProps) {
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'students',
  })

  function onSubmit(e) {
    console.log(form.formState.errors)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {fields.map((field, i) => (
          <div className='flex' key={field.id}>
            <FormField
              control={form.control}
              name={`students.${i}.firstName`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className={cn(
                        form.formState.errors.students?.[i] && 'border-warning',
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type='button'
          onClick={() => append({ firstName: '', lastName: '' })}
        >
          Mehr
        </Button>
        <Button type='submit'>Speichern</Button>
      </form>
    </Form>
  )
}
