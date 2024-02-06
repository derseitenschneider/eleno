import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useStudents } from '../../../../services/context/StudentContext'
import { sortStudents } from '../../../../utils/sortStudents'
import './navigateToStudent.style.scss'

type NavigateToStudentProps = {
  isOpen: boolean
  close: () => void
}
export default function NavigateToStudent({
  isOpen,
  close,
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

  const handleOnClick = (id: number) => {
    const studentIndex = activeSortedStudentIds.indexOf(id)
    setCurrentStudentIndex(studentIndex)
    setSearchInput('')
    close()
  }

  // if (!isOpen) return null
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="navigate-to-student"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: 'easeIn', duration: 0.05 }}
          exit={{ opacity: 0 }}
        >
          <ul className="student-list no-scrollbar">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <li key={student.id}>
                  <button
                    onClick={() => handleOnClick(student.id)}
                    type="button"
                  >{`${student.firstName} ${student.lastName}`}</button>
                </li>
              ))
            ) : (
              <li className="non-found">Keine Schüler gefunden</li>
            )}
          </ul>
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-search"
            placeholder="Suchen..."
            autoFocus={window.screen.width > 1000}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
