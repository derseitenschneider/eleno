import { useContext } from 'react'
import { ContextTypeStudents } from '../types/types'
import { StudentsContext } from '../contexts/StudentContext'

export function useStudents() {
  const { students, setStudents } =
    useContext<ContextTypeStudents>(StudentsContext)

  return { students, setStudents }
}
