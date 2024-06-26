import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useUser } from "@/services/context/UserContext"
import type { Student, StudentPartial } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { StudentInput, studentSchema } from "./StudentForm.component"
import StudentFormRow from "./StudentFormRow.component"
import { useCreateStudents } from "./useCreateStudents"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectItem } from "@radix-ui/react-select"

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
      students: [defaultStudent],
    },
    onSubmit({ value }) {
      console.log(value)
    },
  })
  const [isError, setIsError] = useState(false)
  const [newStudents, setNewStudents] = useState<Array<RowStudent>>([
    {
      ...defaultStudent,
      tempId: Math.round(Math.random() * 1_000_000),
    },
  ])
  const [numStudents, setNumStudents] = useState(1)

  const grid =
    "grid gap-2 items-stretch grid-cols-[8px_1fr_1fr_1fr_1fr_80px_80px_65px_1fr_16px]"

  function addStudents() {
    const additionalStudents = Array.from(Array(numStudents)).map(() => ({
      ...defaultStudent,
      tempId: Math.round(Math.random() * 1_000_000),
    }))
    setNewStudents((prev) => [...prev, ...additionalStudents])
    setNumStudents(1)
  }

  async function onSubmit(data) {
    if (!user) return
    console.log(data)
    // createStudents(
    //   newStudents.map((student) => {
    //     const { tempId, ...newStudent } = student
    //     return { ...newStudent, id: new Date().valueOf(), user_id: user.id }
    //   }),
    // )
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
                  {field.state.value.map((_, i) => {
                    return (
                      <div className={grid} key={i}>
                        <span>{i + 1}</span>
                        <form.Field name={`students[${i}].firstName`}>
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
                                  value={subField.state.value}
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
                  <button
                    onClick={() => field.pushValue(defaultStudent)}
                    type='button'
                  >
                    Add person
                  </button>
                </div>
              )
            }}
          </form.Field>
          <Button type='submit'>Speichern</Button>
        </form>
        {/* {newStudents.map((newStudent, index) => ( */}
        {/*   <StudentFormRow */}
        {/*     form={form} */}
        {/*     onDeleteRow={deleteRow} */}
        {/*     index={index} */}
        {/*     grid={grid} */}
        {/*     key={newStudent.tempId} */}
        {/*     setStudents={setNewStudents} */}
        {/*     student={newStudent} */}
        {/*     setIsError={setIsError} */}
        {/*   /> */}
        {/* ))} */}
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
            className='flex gap-1'
            onClick={addStudents}
          >
            <Plus className='size-4 text-primary' />
            <span>Zeilen hinzufügen</span>
          </Button>
        </div>
        <Button size='sm' variant='outline' onClick={onSuccess}>
          Abbrechen
        </Button>
        <Button size='sm' onClick={onSubmit}>
          Speichern
        </Button>
      </div>
    </div>
  )
}
