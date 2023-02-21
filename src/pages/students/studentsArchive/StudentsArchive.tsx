// Icons
import { IoHandLeft, IoTrashOutline, IoArrowBackCircle } from 'react-icons/io5';


// Hooks
import { useStudents } from '../../../contexts/StudentContext';
import { postDeleteStudents, postRestoreStudent } from '../../../supabase/supabase';
// Components
import StudentRow from '../../../components/studentRow/StudentRow';
import { useState } from 'react';
import MessageModal from '../../../components/modals/message.modal.component';
import { TStudent } from '../../../types/Students.type';


function StudentsArchive() {
  const {students, setStudents} = useStudents();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStudentDelete, setCurrentStudentDelete] = useState<TStudent | null>(null)

  const restoreStudent = (e:React.MouseEvent) => {
    const target = e.target as Element
    const id = +target.closest('button').dataset.id
    const restoredStudent = students.find(student => student.id === id)
    restoredStudent.archive = false
    setStudents([...students])
    postRestoreStudent(id)
  }

  const openModal = (e:React.MouseEvent) => {
    setIsModalOpen(true)
    const target = e.target as Element
    const id = +target.closest('button').dataset.id
    const studentToDelete = students.find(student => student.id === id)
    setCurrentStudentDelete(studentToDelete)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentStudentDelete(null)
  }

  const deleteStudent = () => {
    const newStudents = students.filter(student => student.id !== currentStudentDelete.id)
    setStudents(newStudents)
    postDeleteStudents(currentStudentDelete.id)
    closeModal();
  }
  

  return (
    <div className='student-list'>
      <h1>Archiv</h1>
      <table className='student-list-table'>
        <thead>
          <tr>
            <th></th>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>Instrument</th>
          </tr>
        </thead>
        <tbody>
          {
            students.filter(student => student.archive).map(student => <StudentRow  
            key= {student.id}
            form = {false}
            student={student}
            buttons= {
              [
                {
                  label: 'Wiederherstellen',
                  icon: IoArrowBackCircle,
                  className: 'btn-restore',
                  handler: restoreStudent
                },
                {
                  label: 'Löschen',
                  icon: IoTrashOutline,
                  className: 'btn-delete',
                  handler: openModal
                }
              ]
            }/>)
          }
        
        </tbody>
      </table>

      {isModalOpen && 
        <MessageModal 
        heading='Schüler:in löschen?'
        body='Möchtest du diese:n Schüler:in unwiederruflich löschen?'
        handlerOverlay={ () => {setIsModalOpen(false)}}
        handlerClose= { () => {setIsModalOpen(false)}}
        buttons={[
          {
            label: 'Abbrechen',
            handler: () => {setIsModalOpen(false)}
          },
          {
            label: 'Löschen',
            handler: deleteStudent
          }
        ]}
        />
      }
    </div>
  );
}

export default StudentsArchive;