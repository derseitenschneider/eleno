import MiniLoader from "@/components/ui/MiniLoader.component"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStudents } from "@/services/context/StudentContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import calcTimeDifference from "@/utils/calcTimeDifference"

// -TODO: Validate time inputs
// -TODO: Success toast/sonner
const studentSchema = z.object({
  firstName: z.string().min(1, {
    message: "Vorname fehlt.",
  }),
  lastName: z.string().min(1, { message: "Nachname fehlt." }),
  instrument: z.string().min(1, { message: "Instrument fehlt." }),
  dayOfLesson: z
    .optional(
      z.union([
        z.literal("Montag"),
        z.literal("Dienstag"),
        z.literal("Mittwoch"),
        z.literal("Donnerstag"),
        z.literal("Freitag"),
        z.literal("Samstag"),
        z.literal("Sonntag"),
        z.literal("none"),
      ]),
    )
    .transform((val) => (val === "none" ? null : val)),
  startOfLesson: z.optional(z.string()),
  endOfLesson: z.optional(z.string()),
  durationMinutes: z
    .optional(z.coerce.number().min(1, "Ungültiger Wert."))
    .transform((val) => (val === 0 ? null : val)),
  location: z.optional(z.string()),
})

type StudentInput = z.infer<typeof studentSchema>

type EditStudentProps = {
  studentId?: number
  onSuccess: () => void
}

export default function StudentForm({
  studentId,
  onSuccess,
}: EditStudentProps) {
  const { students, updateStudents } = useStudents()
  const currentStudent = students?.find((student) => student.id === studentId)

  const form = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: currentStudent?.firstName,
      lastName: currentStudent?.lastName,
      instrument: currentStudent?.instrument,
      dayOfLesson: currentStudent?.dayOfLesson,
      startOfLesson: currentStudent?.startOfLesson,
      endOfLesson: currentStudent?.endOfLesson,
      durationMinutes: currentStudent?.durationMinutes,
      location: currentStudent?.location,
    },
    mode: "onSubmit",
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: false,
    },
    shouldFocusError: true,
  })

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) onSuccess()
  }, [onSuccess, form.formState.isSubmitSuccessful])

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

  async function onSubmit(values: StudentInput) {
    if (!currentStudent) return
    try {
      await updateStudents([
        {
          ...values,
          id: currentStudent.id,
          archive: currentStudent.archive,
          user_id: currentStudent.user_id,
        },
      ])
    } catch (err) {
      form.setError("root", {
        message: "Es ist etwas schiefgelaufen. Bitte versuch's nochmal.",
      })
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='flex gap-4'>
          <FormField
            control={form.control}
            name='firstName'
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vorname*</FormLabel>
                <FormControl>
                  <Input placeholder='Vorname' {...field} />
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
                <FormLabel>Nachname*</FormLabel>
                <FormControl>
                  <Input placeholder='Nachname' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='instrument'
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instrument*</FormLabel>
              <FormControl>
                <Input placeholder='Instrument' {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='dayOfLesson'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "none"}
                disabled={form.formState.isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Tag' />
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
            </FormItem>
          )}
        />
        <div className='flex gap-4'>
          <FormField
            control={form.control}
            name='startOfLesson'
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem className='grow-0'>
                <FormLabel>Von</FormLabel>
                <FormControl>
                  <Input type='time' {...field} onBlur={calculateMinutes} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='endOfLesson'
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem className='grow-0'>
                <FormLabel>Bis</FormLabel>
                <FormControl>
                  <Input type='time' {...field} onBlur={calculateMinutes} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='durationMinutes'
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem className='ml-auto grow-1'>
                <FormLabel>Minuten</FormLabel>
                <FormControl>
                  <Input type='number' {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='location'
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ort</FormLabel>
              <FormControl>
                <Input placeholder='Ort' {...field} value={field.value || ""} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className='flex gap-2 items-center'>
          <Button
            size='sm'
            type='submit'
            disabled={form.formState.isSubmitting}
          >
            Speichern
          </Button>
          {form.formState.isSubmitting && <MiniLoader />}
        </div>
      </form>
      {form.formState.errors.root && (
        <p className='mt-2 text-sm text-red-500'>
          {form.formState.errors.root.message}
        </p>
      )}
    </Form>
  )
}
