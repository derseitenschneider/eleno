import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import type { UseFieldArrayRemove, UseFormReturn } from 'react-hook-form'
import type { StudentSchema } from './CreateStudents.component'

type StudentFormRowProps = {
  index: number
  grid: string
  form: UseFormReturn<{ students: StudentSchema[] }, unknown, undefined>
  remove?: UseFieldArrayRemove
  disabled: boolean
}
export default function StudentFormRow({
  index,
  form,
  grid,
  disabled,
  remove,
}: StudentFormRowProps) {
  return (
    <div className={cn(grid, 'mb-2')}>
      <span className='self-center text-sm text-foreground/75'>
        {index + 1}
      </span>
      <FormField
        control={form.control}
        name={`students.${index}.firstName`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder='Vorname'
                {...field}
                className={cn(
                  form.formState.errors.students?.[index]?.firstName &&
                  'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`students.${index}.lastName`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder='Nachname'
                {...field}
                className={cn(
                  form.formState.errors.students?.[index]?.lastName &&
                  'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`students.${index}.instrument`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder='Instrument'
                {...field}
                className={cn(
                  form.formState.errors.students?.[index]?.instrument &&
                  'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`students.${index}.dayOfLesson`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                disabled={disabled}
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
        name={`students.${index}.startOfLesson`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                disabled={disabled}
                type='time'
                {...field}
                value={field.value || ''}
                className={cn(
                  form.formState.errors.students?.[index]?.startOfLesson &&
                  'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`students.${index}.endOfLesson`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                disabled={disabled}
                type='time'
                {...field}
                value={field.value || ''}
                className={cn(
                  form.formState.errors.students?.[index]?.endOfLesson &&
                  'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`students.${index}.durationMinutes`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder='45'
                type='number'
                {...field}
                value={field.value || undefined}
                className={cn(
                  form.formState.errors.students?.[index]?.durationMinutes &&
                  'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`students.${index}.location`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder='Unterrichtsort'
                {...field}
                value={field.value || undefined}
                className={cn(
                  form.formState.errors.students?.[index]?.location &&
                  'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <input
        type='hidden'
        name={`students.${index}.id`}
        value={form.getValues('students')[index]?.id || ''}
        readOnly
      />
      {remove && (
        <Button
          type='button'
          variant='ghost'
          className={cn(index === 0 && 'hidden', 'p-0')}
          onClick={() => remove(index)}
          tabIndex={-1}
          disabled={index === 0 || disabled}
        >
          <Trash2 strokeWidth={1.5} className='size-4 text-warning' />
        </Button>
      )}
    </div>
  )
}
