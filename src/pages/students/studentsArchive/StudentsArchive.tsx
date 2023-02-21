// Icons
import { IoHandLeft, IoTrashOutline, IoArrowBackCircle } from 'react-icons/io5';


// Hooks
import { useStudents } from '../../../contexts/StudentContext';

// Components
import StudentRow from '../../../components/studentRow/StudentRow';
import { useState } from 'react';
import MessageModal from '../../../components/modals/message.modal.component';
import { postRestoreStudent } from '../../../supabase/supabase';


function StudentsArchive() {
  const {students, setStudents} = useStudents();
  const [isModalOpen, setIsModalOpen] = useState(false)

  const restoreStudent = (e:React.MouseEvent) => {
    const target = e.target as Element
    const id = +target.closest('button').dataset.id
    const restoredStudent = students.find(student => student.id === id)
    restoredStudent.archive = false
    setStudents([...students])
    postRestoreStudent(id);
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
                  handler: () => {setIsModalOpen(true)}
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
            handler: () =>{}
          }
        ]}
        />
      }
    </div>
  );
}

export default StudentsArchive;