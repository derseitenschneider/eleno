import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Student, StudentPartial } from "@/types/types"
import { Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { FieldApi, useForm } from "@tanstack/react-form"
import { useCreateStudents } from "./useCreateStudents"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"
import { useUser } from "@/services/context/UserContext"
import { z } from "zod"

type CreateStudentsProps = {
  onSuccess: () => void
}
export type RowStudent = Omit<StudentPartial, "user_id" | "archive"> & {
  tempId?: number
}
const defaultStudent: RowStudent = {
  firstName: "",
  lastName: "",
  location: "",
  instrument: "",
  dayOfLesson: null,
  startOfLesson: "",
  endOfLesson: "",
  durationMinutes: null,
}

export default function CreateStudents({ onSuccess }: CreateStudentsProps) {
  const { user } = useUser()
  const { createStudents, isCreating } = useCreateStudents()

  const form = useForm({
    defaultValues: {
      students: [
        { ...defaultStudent, tempId: Math.trunc(Math.random() * 1_000_000) },
      ] as Array<RowStudent>,
    },

    onSubmit({ value }) {
      if (!user) return
      const newStudents = value.students.map(({ tempId, ...student }) => ({
        ...student,
        archive: false,
        user_id: user.id,
        startOfLesson: student.startOfLesson || null,
        endOfLesson: student.endOfLesson || null,
      }))
      createStudents(newStudents, {
        onSuccess,
      })
    },
    validatorAdapter: zodValidator(),
  })

  const [numStudents, setNumStudents] = useState(1)

  const GRID =
    "grid gap-2 items-stretch grid-cols-[8px_1fr_1fr_1fr_1fr_80px_80px_65px_1fr_16px]"

  function addRow(
    field: FieldApi<
      { students: Array<RowStudent> },
      "students",
      undefined,
      undefined,
      Array<RowStudent>
    >,
  ) {
    const additionalStudents = Array.from(Array(numStudents)).map(() => ({
      ...defaultStudent,
      tempId: Math.trunc(Math.random() * 1_000_000),
    }))

    for (const additionalStudent of additionalStudents) {
      field.pushValue({ ...additionalStudent })
    }
    setNumStudents(1)
  }

  return (
    <div className='w-[90vw] pt-2 pl-1'>
      <div className={cn(GRID, "p-1")}>
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
                  <div className='max-h-[60vh] overflow-auto no-scrollbar p-1'>
                    {field.state.value.map((value, i) => {
                      return (
                        <div className={cn(GRID, "mb-1")} key={value.tempId}>
                          <span className='text-xs text-foreground/75 self-center'>
                            {i + 1}
                          </span>
                          <form.Field
                            name={`students[${i}].firstName`}
                            preserveValue
                            validators={{
                              onSubmit: z.string().min(2).max(25),
                            }}
                          >
                            {(subField) => {
                              return (
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  className={cn(
                                    subField.state.meta.errors.length
                                      ? "border-warning"
                                      : null,
                                  )}
                                />
                              )
                            }}
                          </form.Field>
                          <form.Field
                            name={`students[${i}].lastName`}
                            preserveValue
                            validators={{
                              onSubmit: z.string().min(2).max(25),
                            }}
                          >
                            {(subField) => {
                              return (
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  className={cn(
                                    subField.state.meta.errors.length
                                      ? "border-warning"
                                      : null,
                                  )}
                                />
                              )
                            }}
                          </form.Field>
                          <form.Field
                            name={`students[${i}].instrument`}
                            preserveValue
                            validators={{
                              onSubmit: z.string().min(2).max(25),
                            }}
                          >
                            {(subField) => {
                              return (
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  className={cn(
                                    subField.state.meta.errors.length
                                      ? "border-warning"
                                      : null,
                                  )}
                                />
                              )
                            }}
                          </form.Field>
                          <form.Field
                            name={`students[${i}].dayOfLesson`}
                            preserveValue
                          >
                            {(subField) => {
                              return (
                                <Select
                                  onValueChange={(e) => {
                                    subField.handleChange(e)
                                  }}
                                  defaultValue={subField.state.value || ""}
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
                          <form.Field
                            name={`students[${i}].startOfLesson`}
                            preserveValue
                          >
                            {(subField) => {
                              return (
                                <Input
                                  type='time'
                                  value={subField.state.value || ""}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              )
                            }}
                          </form.Field>
                          <form.Field
                            name={`students[${i}].endOfLesson`}
                            preserveValue
                          >
                            {(subField) => {
                              return (
                                <Input
                                  type='time'
                                  value={subField.state.value || ""}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              )
                            }}
                          </form.Field>
                          <form.Field
                            name={`students[${i}].durationMinutes`}
                            preserveValue
                          >
                            {(subField) => {
                              return (
                                <Input
                                  type='number'
                                  value={subField.state.value || ""}
                                  onChange={(e) =>
                                    subField.handleChange(
                                      e.target.valueAsNumber,
                                    )
                                  }
                                />
                              )
                            }}
                          </form.Field>
                          <form.Field
                            name={`students[${i}].location`}
                            preserveValue
                          >
                            {(subField) => {
                              return (
                                <Input
                                  value={subField.state.value || ""}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              )
                            }}
                          </form.Field>
                          <Button
                            tabIndex={-1}
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
                  <div className='flex gap-4 items-center mt-4 justify-between'>
                    <div className='flex items-center'>
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
                    {field.state.meta.errors.length ? (
                      <span className='text-sm text-warning'>
                        {field.state.meta.errors.join(", ")}
                      </span>
                    ) : null}
                    <div className='flex gap-4 items-center'>
                      <Button size='sm' variant='outline' onClick={onSuccess}>
                        Abbrechen
                      </Button>
                      <Button size='sm' type='submit'>
                        Speichern
                      </Button>
                    </div>
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
