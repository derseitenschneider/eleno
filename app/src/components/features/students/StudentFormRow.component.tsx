import { memo } from 'react'
import { useFormContext } from 'react-hook-form'
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
import type { UseFieldArrayRemove } from 'react-hook-form'
import type { StudentSchema } from './CreateStudents.component'

type StudentFormRowProps = {
  index: number
  grid: string
  remove?: UseFieldArrayRemove
  disabled: boolean
  fields: number
  autoFocus?: boolean
}

const StudentFormRow = memo(function StudentFormRow({
  index,
  grid,
  disabled,
  remove,
  fields,
  autoFocus = false,
}: StudentFormRowProps) {
  const { control, formState, getValues } = useFormContext<{
    students: StudentSchema[]
  }>()
  const isNoTrash = index === 0 && fields === 1

  return (
    <div className={cn(grid, 'mb-2')}>
      <span className='hidden sm:inline self-center text-sm text-foreground/75'>
        {index + 1}
      </span>
      <FormField
        control={control}
        name={`students.${index}.firstName`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                autoFocus={autoFocus}
                disabled={disabled}
                placeholder='Vorname'
                {...field}
                className={cn(
                  formState.errors.students?.[index]?.firstName &&
                    'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`students.${index}.lastName`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder='Nachname'
                {...field}
                className={cn(
                  formState.errors.students?.[index]?.lastName &&
                    'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`students.${index}.instrument`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder='Instrument'
                {...field}
                className={cn(
                  formState.errors.students?.[index]?.instrument &&
                    'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
                  <SelectValue placeholder='—' />
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
        control={control}
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
                  formState.errors.students?.[index]?.startOfLesson &&
                    'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
                  formState.errors.students?.[index]?.endOfLesson &&
                    'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
                  formState.errors.students?.[index]?.durationMinutes &&
                    'border-warning',
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
                  formState.errors.students?.[index]?.location &&
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
        value={getValues(`students.${index}.id`) || ''}
        readOnly
      />
      {remove && (
        <Button
          type='button'
          variant='ghost'
          className={cn(isNoTrash && 'hidden', 'p-0')}
          onClick={() => remove(index)}
          tabIndex={-1}
          disabled={isNoTrash || disabled}
        >
          <Trash2 strokeWidth={1.5} className='size-4 text-warning' />
        </Button>
      )}
    </div>
  )
})

export default StudentFormRow
