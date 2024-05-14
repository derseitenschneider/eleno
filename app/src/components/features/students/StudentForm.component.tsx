import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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

const studentSchema = z.object({
  firstName: z.string().min(1, {
    message: "Vorname fehlt.",
  }),
  lastName: z.string().min(1, { message: "Nachname fehlt." }),
  instrument: z.string().min(1, { message: "Instrument fehlt." }),
  dayOfLesson: z.optional(
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
  ),
  startOfLesson: z.optional(z.string()),
  endOfLesson: z.optional(z.string()),
  durationMinutes: z.optional(z.coerce.number()),
  location: z.optional(z.string()),
})

type StudentInput = z.infer<typeof studentSchema>

type EditStudentProps = {
  studentId?: number
}

export default function StudentForm({ studentId }: EditStudentProps) {
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
  })

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
      console.log(err)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='flex gap-4'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vorname</FormLabel>
                <FormControl>
                  <Input placeholder='Vorname' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nachname</FormLabel>
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instrument</FormLabel>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <SelectItem value='null'>-</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className='flex gap-4'>
          <FormField
            control={form.control}
            name='startOfLesson'
            render={({ field }) => (
              <FormItem className='grow-0'>
                <FormLabel>Von</FormLabel>
                <FormControl>
                  <Input type='time' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='endOfLesson'
            render={({ field }) => (
              <FormItem className='grow-0'>
                <FormLabel>Bis</FormLabel>
                <FormControl>
                  <Input type='time' {...field} value={field.value || ""} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='durationMinutes'
            render={({ field }) => (
              <FormItem className='ml-auto basis-20'>
                <FormLabel>Minuten</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ort</FormLabel>
              <FormControl>
                <Input placeholder='Ort' {...field} value={field.value || ""} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit'>Speichern</Button>
      </form>
    </Form>
  )
}
