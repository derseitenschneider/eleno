import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useStudents } from "@/services/context/StudentContext"
import type { TStudent } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const studentSchema = z.object({
  firstName: z.string().min(1, {
    message: "Vorname fehlt.",
  }),
  lastName: z.string().min(1, { message: "Nachname fehlt." }),
  instrument: z.string().min(1, { message: "Instrument fehlt" }),
  durationMinutes: z.string(),
  location: z.string(),
  dayOfLesson: z.string(),
  startOfLesson: z.string(),
  endOfLesson: z.string(),
})

type EditStudentProps = {
  studentId?: number
}

export default function EditStudent({ studentId }: EditStudentProps) {
  const { students } = useStudents()
  const currentStudent = students?.find((student) => student.id === studentId)

  const form = useForm<TStudent>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: currentStudent?.firstName || "",
      lastName: currentStudent?.lastName || "",
      instrument: currentStudent?.instrument || "",
      dayOfLesson: currentStudent?.dayOfLesson || "",
      startOfLesson: currentStudent?.startOfLesson || "",
      endOfLesson: currentStudent?.endOfLesson || "",
      durationMinutes: currentStudent?.durationMinutes || "",
      location: currentStudent?.location || "",
    },
  })

  function onSubmit(values: TStudent) {
    console.log(values)
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
              <FormControl>
                <Input placeholder='Tag' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className='flex gap-4'>
          <FormField
            control={form.control}
            name='startOfLesson'
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
                <FormLabel>Bis</FormLabel>
                <FormControl>
                  <Input type='time' {...field} />
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
                <Input placeholder='Ort' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit'>Speichern</Button>
      </form>
    </Form>
  )
}
