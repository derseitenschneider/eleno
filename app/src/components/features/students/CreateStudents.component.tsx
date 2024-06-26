import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { StudentPartial } from "@/types/types"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useCreateStudents } from "./useCreateStudents"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"
import { useUser } from "@/services/context/UserContext"

type CreateStudentsProps = {
  onSuccess: () => void
}
export type RowStudent = Omit<StudentPartial & { tempId: number }, "user_id">
const defaultStudent = {
  firstName: "",
  lastName: "",
  archive: false,
  location: "",
  instrument: "",
  dayOfLesson: null,
  startOfLesson: "",
  endOfLesson: "",
  durationMinutes: null,
}

export default function CreateStudents({ onSuccess }: CreateStudentsProps) {
  const { user } = useUser()
  const {
    createStudents,
    isCreating,
    isError: isErrorCreating,
  } = useCreateStudents()

  const form = useForm({
    defaultValues: {
      students: [] as Array<StudentPartial>,
    },
    onSubmit({ value }) {
      if (!user) return
      const newStudents = value.students.map((student) => ({
        ...student,
        startOfLesson: student.startOfLesson || null,
        endOfLesson: student.endOfLesson || null,
        user_id: user.id,
      }))
      console.log(newStudents)
    },
  })

  const [numStudents, setNumStudents] = useState(1)

  const grid =
    "grid gap-2 items-stretch grid-cols-[8px_1fr_1fr_1fr_1fr_80px_80px_65px_1fr_16px]"

  function addRow(field) {
    const additionalStudents = Array.from(Array(numStudents)).map(() => ({
      ...defaultStudent,
      tempId: Math.trunc(Math.random() * 1_000_000),
    }))
    console.log(additionalStudents)
    for (const additionalStudent in additionalStudents) {
      field.pushValue(additionalStudent)
    }
    setNumStudents(1)
  }

  return (
    <div className='w-[90vw] pt-2 pl-1'>
      <div className={cn(grid, "p-1")}>
        <p />
        <p className='text-sm pl-3'>Vorname*</p>
        <span className='text-sm pl-3'>Nachname*</span>
        <span className='text-sm pl-3'>Instrument*</span>
        <span className='text-sm pl-3'>Tag</span>
        <span className='text-sm pl-3'>Von</span>
        <span className='text-sm pl-3'>Bis</span>
        <span className='text-sm pl-3'>Dauer</span>
        <span className='text-sm pl-3'>Unterrichtsort</span>
        <span />
      </div>
      <div className='w-full overflow-auto p-1'>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field name='students' mode='array'>
            {(field) => {
              return (
                <div>
                  <div className='h-[60vh] overflow-auto no-scrollbar p-1'>
                    {field.state.value.map((value, i) => {
                      return (
                        <div className={cn(grid, "mb-1")} key={value.tempId}>
                          <span className='text-xs text-foreground/75 self-center'>
                            {i + 1}
                          </span>
                          <form.Field name={`students[${i}].firstName`}>
                            {(subField) => {
                              return (
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              )
                            }}
                          </form.Field>
                          <form.Field name={`students[${i}].lastName`}>
                            {(subField) => {
                              return (
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              )
                            }}
                          </form.Field>
                          <form.Field name={`students[${i}].instrument`}>
                            {(subField) => {
                              return (
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              )
                            }}
                          </form.Field>
                          <form.Field name={`students[${i}].dayOfLesson`}>
                            {(subField) => {
                              return (
                                <Select
                                  onValueChange={(e) => {
                                    subField.handleChange(e)
                                  }}
                                  defaultValue={subField.state.value || ""}
                                  // disabled={form.formState.isSubmitting}
                                >
                                  <SelectTrigger className='h-9'>
                                    <SelectValue placeholder='Unterrichtstag' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value='Montag'>
                                      Montag
                                    </SelectItem>
                                    <SelectItem value='Dienstag'>
                                      Dienstag
                                    </SelectItem>
                                    <SelectItem value='Mittwoch'>
                                      Mittwoch
                                    </SelectItem>
                                    <SelectItem value='Donnerstag'>
                                      Donnerstag
                                    </SelectItem>
                                    <SelectItem value='Freitag'>
                                      Freitag
                                    </SelectItem>
                                    <SelectItem value='Samstag'>
                                      Samstag
                                    </SelectItem>
                                    <SelectItem value='Sonntag'>
                                      Sonntag
                                    </SelectItem>
                                    <SelectItem value='none'>-</SelectItem>
                                  </SelectContent>
                                </Select>
                              )
                            }}
                          </form.Field>
                          <form.Field name={`students[${i}].startOfLesson`}>
                            {(subField) => {
                              return (
                                <Input
                                  type='time'
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              )
                            }}
                          </form.Field>
                          <form.Field name={`students[${i}].endOfLesson`}>
                            {(subField) => {
                              return (
                                <Input
                                  type='time'
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              )
                            }}
                          </form.Field>
                          <form.Field name={`students[${i}].durationMinutes`}>
                            {(subField) => {
                              return (
                                <Input
                                  type='number'
                                  value={subField.state.value || ""}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              )
                            }}
                          </form.Field>
                          <form.Field name={`students[${i}].location`}>
                            {(subField) => {
                              return (
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              )
                            }}
                          </form.Field>
                          <Button
                            variant='ghost'
                            type='button'
                            size='icon'
                            className='w-fit justify-self-end'
                            onClick={() => field.removeValue(i)}
                          >
                            <Trash2 className='size-4 text-warning' />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                  <div className='flex gap-4 items-center mt-4 justify-end'>
                    <div className='mr-auto flex items-center'>
                      <Input
                        type='number'
                        className='w-[60px]'
                        value={numStudents}
                        onChange={(e) => setNumStudents(Number(e.target.value))}
                      />
                      <Button
                        variant='ghost'
                        size='sm'
                        type='button'
                        className='flex gap-1'
                        onClick={() => addRow(field)}
                      >
                        <Plus className='size-4 text-primary' />
                        <span>Zeilen hinzufügen</span>
                      </Button>
                    </div>
                    <Button size='sm' variant='outline' onClick={onSuccess}>
                      Abbrechen
                    </Button>
                    <Button size='sm' type='submit'>
                      Speichern
                    </Button>
                  </div>
                </div>
              )
            }}
          </form.Field>
        </form>
      </div>
    </div>
  )
}
