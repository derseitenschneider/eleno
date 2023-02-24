import { TSorting, TStudent } from '../types/types'

const compareLastName = (a: TStudent, b: TStudent) => {
  const studentA = a.lastName.toUpperCase()
  const studentB = b.lastName.toUpperCase()

  let comparison = 0
  if (studentA > studentB) {
    comparison = 1
  } else if (studentA < studentB) {
    comparison = -1
  }
  return comparison
}

const compareInstrument = (a: TStudent, b: TStudent) => {
  const studentA = a.instrument.toUpperCase()
  const studentB = b.instrument.toUpperCase()

  let comparison = 0
  if (studentA > studentB) {
    comparison = 1
  } else if (studentA < studentB) {
    comparison = -1
  }
  return comparison
}

export const sortStudents = (students: TStudent[], sorting: TSorting) => {
  switch (sorting) {
    case 'lastName':
      return students.sort(compareLastName)
      break
    case 'instrument':
      return students.sort(compareInstrument)
      break
    default:
      return students
  }
}
