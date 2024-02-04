import { useEffect, useRef, useState } from 'react'
import { useStudents } from '../../../../services/context/StudentContext'
import './navigateToStudent.style.scss'
import { sortStudents } from '../../../../utils/sortStudents'

type NavigateToStudentProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default function NavigateToStudent({
  isOpen,
  setIsOpen,
}: NavigateToStudentProps) {
  const { activeStudents, activeSortedStudentIds, setCurrentStudentIndex } =
    useStudents()
  const [searchInput, setSearchInput] = useState('')
  const sortedActiveStudents = sortStudents(activeStudents, {
    sort: 'lastName',
    ascending: 'true',
  })

  const filteredStudents = sortedActiveStudents.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchInput.toLowerCase()),
  )

  const panel = useRef()

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!isOpen) return
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isOpen])

  const handleOnClick = (id: number) => {
    const studentIndex = activeSortedStudentIds.indexOf(id)
    setCurrentStudentIndex(studentIndex)
  }

  if (!isOpen) return null
  return (
    <div className="navigate-to-student" ref={panel}>
      <ul className="student-list no-scrollbar">
        {filteredStudents.map((student) => (
          <li key={student.id}>
            <button
              onClick={() => handleOnClick(student.id)}
              type="button"
            >{`${student.firstName} ${student.lastName}`}</button>
          </li>
        ))}
      </ul>
      <input
        type="search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
  )
}
