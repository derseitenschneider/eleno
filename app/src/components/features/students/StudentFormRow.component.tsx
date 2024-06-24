import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Student } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2 } from "lucide-react"
import type { FormEvent } from "react"
import { useForm } from "react-hook-form"
import calcTimeDifference from "../../../utils/calcTimeDifference"
import type { RowStudent } from "./CreateStudents.component"
import { type StudentInput, studentSchema } from "./StudentForm.component"

type EditStudentRowProps = {
  index?: number
  onDeleteRow?: (tempId: number) => void
  student: RowStudent & Student
  setStudents: React.Dispatch<
    React.SetStateAction<Array<Student & RowStudent> | undefined>
  >
  setIsError: React.Dispatch<React.SetStateAction<boolean>>
  grid: string
}

function StudentFormRow({
  onDeleteRow,
  index,
  student,
  setStudents,
  setIsError,
  grid,
}: EditStudentRowProps) {
  const form = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: student?.firstName || "",
      lastName: student?.lastName || "",
      instrument: student?.instrument || "",
      dayOfLesson: student?.dayOfLesson || null,
      startOfLesson: student?.startOfLesson || "",
      endOfLesson: student?.endOfLesson || "",
      durationMinutes: student?.durationMinutes || null,
      location: student?.location || "",
    },
    mode: "onChange",
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: false,
    },
    shouldFocusError: true,
  })

  function calculateMinutes() {
    if (form.getValues("startOfLesson") && form.getValues("endOfLesson")) {
      const difference = calcTimeDifference(
        form.getValues("startOfLesson") || "",
        form.getValues("endOfLesson") || "",
      )
      if (difference && difference > 0)
        form.setValue("durationMinutes", difference)
    }
  }

  function deleteRow(e) {
    e.preventDefault()
    onDeleteRow?.(student.tempId)
  }

  const onChange = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement
    const name = target.name
    const value = target.value
    setStudents((prev) => {
      if (!prev || !student) return
      // When student has no tempId, we are editing a student.
      if (!student.tempId) {
        return prev.map((prevStudent) =>
          prevStudent.id === student.id
            ? { ...student, [name]: value }
            : prevStudent,
        )
      }
      // When student has tempId, we are creating a student.
      if (student.tempId)
        return prev.map((prevStudent) =>
          prevStudent.tempId === student.tempId
            ? { ...student, [name]: value }
            : prevStudent,
        )
    })
  }
  return (
    <Form {...form}>
      <div className='flex relative w-full gap-1'>
        <form onChange={onChange} className={cn(grid, "mb-2 grow")}>
          {index !== undefined ? (
            <span className='text-xs text-foreground/75 self-center justify-self-center'>
              {index + 1}.
            </span>
          ) : null}
          <FormField
            control={form.control}
            name='firstName'
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className={cn(
                      form.formState.errors.firstName && "border-warning",
                      "h-full",
                    )}
                    placeholder='Vorname'
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastName'
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Nachname'
                    className={cn(
                      form.formState.errors.lastName && "border-warning",
                      "h-full",
                    )}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='instrument'
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Instrument'
                    className={cn(
                      form.formState.errors.instrument && "border-warning",
                      "h-full",
                    )}
                    {...field}
                    value={field.value || ""}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                  disabled={form.formState.isSubmitting}
                  name='dayOfLesson'
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        form.formState.errors.dayOfLesson &&
                          "border-warning text-warning",
                      )}
                    >
                      <SelectValue placeholder='Unterrichtstag' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Montag'>Montag</SelectItem>
                    <SelectItem value='Dienstag'>Dienstag</SelectItem>
                    <SelectItem value='Mittwoch'>Mittwoch</SelectItem>
                    <SelectItem value='Donnerstag'>Donnerstag</SelectItem>
                    <SelectItem value='Freitag'>Freitag</SelectItem>
                    <SelectItem value='Samstag'>Samstag</SelectItem>
                    <SelectItem value='Sonntag'>Sonntag</SelectItem>
                    <SelectItem value='none'>-</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='startOfLesson'
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem className='grow-0'>
                <FormControl>
                  <Input
                    className={cn(
                      form.formState.errors.startOfLesson && "border-warning",
                      "h-full",
                    )}
                    type='time'
                    {...field}
                    onBlur={calculateMinutes}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='endOfLesson'
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem className='grow-0'>
                <FormControl>
                  <Input
                    type='time'
                    className={cn(
                      form.formState.errors.endOfLesson && "border-warning",
                      "h-full",
                    )}
                    {...field}
                    value={field.value || ""}
                    onBlur={calculateMinutes}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='durationMinutes'
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem className='ml-auto grow-1'>
                <FormControl>
                  <Input
                    placeholder='45'
                    type='number'
                    className={cn(
                      form.formState.errors.durationMinutes && "border-warning",
                      "h-full",
                    )}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='location'
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Ort'
                    className={cn(
                      form.formState.errors.location && "border-warning",
                      "h-full",
                    )}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {student.tempId && (
            <Button
              variant='ghost'
              size='icon'
              className='w-fit justify-self-end'
              onClick={deleteRow}
            >
              <Trash2 className='size-4 text-warning' />
            </Button>
          )}
        </form>
        {form.formState.errors.root && (
          <p className='mt-2 text-sm text-warning'>
            {form.formState.errors.root.message}
          </p>
        )}
      </div>
    </Form>
  )
}

export default StudentFormRow
