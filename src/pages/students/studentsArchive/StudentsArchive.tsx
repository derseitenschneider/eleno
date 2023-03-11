// Icons
import { IoHandLeft, IoTrashOutline, IoArrowBackCircle } from 'react-icons/io5'

// Hooks
import { useStudents } from '../../../contexts/StudentContext'
import {
  postDeleteStudents,
  postRestoreStudent,
} from '../../../supabase/students/students.supabase'
// Components
import StudentRow from '../../../components/studentRow/StudentRow'
import { useState } from 'react'
import MessageModal from '../../../components/modals/modal.component'
import { TStudent } from '../../../types/types'
import { toast } from 'react-toastify'

function StudentsArchive() {
  const { students, setStudents } = useStudents()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStudentDelete, setCurrentStudentDelete] =
    useState<TStudent | null>(null)

  const restoreStudent = (e: React.MouseEvent) => {
    const target = e.target as Element
    const id = +target.closest('button').dataset.id
    const newStudents = students.map((student) =>
      student.id === id ? { ...student, archive: false } : student
    )
    setStudents(newStudents)
    postRestoreStudent(id)
    toast('Schüler:in wiederhergestellt')
  }

  const openModal = (e: React.MouseEvent) => {
    setIsModalOpen(true)
    const target = e.target as Element
    const id = +target.closest('button').dataset.id
    const studentToDelete = students.find((student) => student.id === id)
    setCurrentStudentDelete(studentToDelete)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentStudentDelete(null)
  }

  const deleteStudent = () => {
    const newStudents = students.filter(
      (student) => student.id !== currentStudentDelete.id
    )
    setStudents(newStudents)
    postDeleteStudents(currentStudentDelete.id)
    closeModal()
  }

  const archiveStudents = students.filter((student) => student.archive)
  // [ ] create link back to main list
  return (
    <div className="student-list">
      <h1>Archiv</h1>
      {archiveStudents.length ? (
        <table className="student-list-table">
          <thead>
            <tr>
              <th></th>
              <th>Vorname</th>
              <th>Nachname</th>
              <th>Instrument</th>
            </tr>
          </thead>
          <tbody>
            {archiveStudents.map((student) => (
              <StudentRow
                key={student.id}
                form={false}
                student={student}
                buttons={[
                  {
                    label: 'Wiederherstellen',
                    icon: IoArrowBackCircle,
                    className: 'btn-restore',
                    handler: restoreStudent,
                  },
                  {
                    label: 'Löschen',
                    icon: IoTrashOutline,
                    className: 'btn-delete',
                    handler: openModal,
                  },
                ]}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <em>Das Archiv ist akutell leer.</em>
      )}

      {isModalOpen && (
        <MessageModal
          heading="Schüler:in löschen?"
          handlerOverlay={() => {
            setIsModalOpen(false)
          }}
          handlerClose={() => {
            setIsModalOpen(false)
          }}
          buttons={[
            {
              label: 'Abbrechen',
              handler: () => {
                setIsModalOpen(false)
              },
              btnStyle: 'primary',
            },
            {
              label: 'Löschen',
              handler: deleteStudent,
              btnStyle: 'danger',
            },
          ]}
        >
          <p>Möchtest alle Daten diese:r Schüler:in unwiederruflich löschen?</p>
        </MessageModal>
      )}
    </div>
  )
}

export default StudentsArchive
