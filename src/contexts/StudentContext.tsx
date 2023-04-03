import { useOutletContext } from 'react-router-dom'
import { ContextTypeStudents } from '../types/types'
import { createContext, useContext, useEffect, useState } from 'react'
import { fetchStudents } from '../supabase/students/students.supabase'

export const StudentsContext = createContext<ContextTypeStudents>({
  students: [],
  setStudents: () => {},
})

export const StudentsProvider = ({ children }) => {
  const [students, setStudents] = useState([])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await fetchStudents(userId)
  //       setStudents((prev) => [...prev, ...data])
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchData()
  // }, [userId])

  return (
    <StudentsContext.Provider value={{ students, setStudents }}>
      {children}
    </StudentsContext.Provider>
  )
}
