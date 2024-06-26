import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useUser } from "@/services/context/UserContext"
import type { Student, StudentPartial } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { FieldApi, useForm } from "@tanstack/react-form"
import { StudentInput, studentSchema } from "./StudentForm.component"
import StudentFormRow from "./StudentFormRow.component"
import { useCreateStudents } from "./useCreateStudents"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"

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
  tempId: new Date().valueOf(),
}

export default function CreateStudents({ onSuccess }: CreateStudentsProps) {
  const {
    createStudents,
    isCreating,
    isError: isErrorCreating,
  } = useCreateStudents()

  const form = useForm({
    defaultValues: {
      students: [defaultStudent],
    },
    onSubmit({ value }) {
      console.log(value)
    },
  })

  const [numStudents, setNumStudents] = useState(1)

  const grid =
    "grid gap-2 items-stretch grid-cols-[8px_1fr_1fr_1fr_1fr_80px_80px_65px_1fr_16px]"

  function addRow(field) {
    const additionalStudents = Array.from(Array(numStudents)).map(() => ({
      ...defaultStudent,
    }))
    for (const additionalStudent in additionalStudents) {
      field.pushValue(additionalStudent)
    }
    setNumStudents(1)
  }

  return (
    <div className='w-[90vw] pt-2 pl-1'>
      <div className={grid}>
        <span />
        <span className='text-sm ml-3'>Vorname*</span>
        <span className='text-sm ml-3'>Nachname*</span>
        <span className='text-sm ml-3'>Instrument*</span>
        <span className='text-sm ml-3'>Tag</span>
        <span className='text-sm ml-3'>Von</span>
        <span className='text-sm ml-3'>Bis</span>
        <span className='text-sm ml-3'>Dauer</span>
        <span className='text-sm ml-3'>Unterrichtsort</span>
      </div>
      <div className='max-h-[75vh] no-scrollbar w-full overflow-auto p-1'>
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
                  {field.state.value.map((value, i) => {
                    return (
                      <div className={cn(grid, "mb-1")} key={i}>
                        <span className='text-xs text-foreground/75 self-center'>
                          {i + 1}
                        </span>
                        <form.Field name={`students[${i}].firstName`}>
                          {(subField) => {
                            return (
                              <div>
                                <Input
                                  className='h-full'
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              </div>
                            )
                          }}
                        </form.Field>
                        <form.Field name={`students[${i}].lastName`}>
                          {(subField) => {
                            return (
                              <div>
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              </div>
                            )
                          }}
                        </form.Field>
                        <form.Field name={`students[${i}].instrument`}>
                          {(subField) => {
                            return (
                              <div>
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              </div>
                            )
                          }}
                        </form.Field>
                        <form.Field name={`students[${i}].dayOfLesson`}>
                          {(subField) => {
                            return (
                              <div>
                                <Select
                                  onValueChange={(e) => {
                                    subField.handleChange(e)
                                  }}
                                  defaultValue={subField.state.value || ""}
                                  // disabled={form.formState.isSubmitting}
                                >
                                  <SelectTrigger>
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
                              </div>
                            )
                          }}
                        </form.Field>
                        <form.Field name={`students[${i}].startOfLesson`}>
                          {(subField) => {
                            return (
                              <div>
                                <Input
                                  type='time'
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              </div>
                            )
                          }}
                        </form.Field>
                        <form.Field name={`students[${i}].endOfLesson`}>
                          {(subField) => {
                            return (
                              <div>
                                <Input
                                  type='time'
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              </div>
                            )
                          }}
                        </form.Field>
                        <form.Field name={`students[${i}].durationMinutes`}>
                          {(subField) => {
                            return (
                              <div>
                                <Input
                                  type='number'
                                  value={subField.state.value || ""}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              </div>
                            )
                          }}
                        </form.Field>
                        <form.Field name={`students[${i}].location`}>
                          {(subField) => {
                            return (
                              <div>
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              </div>
                            )
                          }}
                        </form.Field>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='w-fit justify-self-end'
                          onClick={() => field.removeValue(i)}
                        >
                          <Trash2 className='size-4 text-warning' />
                        </Button>
                      </div>
                    )
                  })}
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
