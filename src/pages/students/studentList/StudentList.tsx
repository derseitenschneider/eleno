import { useState } from 'react';
import { useStudents } from '../../../Application';
import { IoTrashOutline } from 'react-icons/io5';
import { IoPersonAddOutline } from 'react-icons/io5';
import { IoSearchOutline } from 'react-icons/io5';
import { IoCloseOutline } from 'react-icons/io5';
import './studentlist.styles.scss'



export default function StudentList() {
  const {students}  = useStudents()
  const [newStudentRowOpen, setNewStudentRowOpen] = useState(false)

  const addStudentEventHandler = () => {
    setNewStudentRowOpen(!newStudentRowOpen)
    inputRef.current.focus()
  }


  return (
    <div className='student-list'>
      <div className="heading">
        <h1>Schülerliste</h1>
        <div className="container-right">
            <IoSearchOutline className='icon icon-search'/>
            <input type="search" placeholder='suchen'/>
            <button 
            title='Schüler:in erfassen'
            onClick={addStudentEventHandler}>
              <IoPersonAddOutline className='icon icon-add'/>
            </button>
        </div>
        </div>
      
      <table className='student-list-table'>
        <thead>
        <tr>
          <th>Vorname</th>
          <th>Nachname</th>
          <th>Instrument</th>
          <th>Tag</th>
          <th>Zeit</th>
          <th>Dauer</th>
          <th>Unterrichtsort</th>
        </tr>
        </thead>
        <tbody>
        {students.filter(student => !student.archive).map(student =>
          <tr>
            <td>
              <input
              type='text'
              value = {student.firstName}
              />
              </td>
            <td>
               <input
              type='text'
              value = {student.lastName}
              />
              </td>
            <td>
               <input
              type='text'
              value = {student.instrument}
              />
              </td>
            <td>
                <select name='dayOfLesson' id="" defaultValue={student.dayOfLesson}>
                  <option value="Montag">Montag</option>
                  <option value="Dienstag">Dienstag</option>
                  <option value="Mittwoch">Mittwoch</option>
                  <option value="Donnerstag">Donnerstag</option>
                  <option value="Freitag">Freitag</option>
                </select>
            </td>
            <td>
                <input
              type='text'
              value = {student.startOfLesson}
              className = 'input-time'
              />
              <span> - </span> 
                <input
              type='text'
              value = {student.endOfLesson}
               className = 'input-time'
              />
               </td>
            <td>
              <input 
              type="text"  
              value={student.durationMinutes}
              className='input-duration'
              />
              <span>min</span>
              </td>
              <td>
                <input 
                type="text" 
                value={student.location} 
                className='input-location'
                />
              </td>
              <td>
                <button title='Archivieren'><IoTrashOutline className='icon icon-trash'/></button>
                
              </td>
          </tr>
          )}

        
          </tbody>
      </table>

        {newStudentRowOpen && 
        <table className="student-list-table add-new">
          <tr className='new-student-row'>
            <td>
              <input
              type='text'
              placeholder='Vorname'
              autoFocus
              />
              </td>
            <td>
               <input
              type='text'
              placeholder='Nachname'
              />
              </td>
            <td>
               <input
              type='text'
              placeholder='Instrument'
              />
              </td>
            <td>
                <select name='dayOfLesson' id="" >
                  <option selected disabled hidden>Tag</option>
                  <option value="Montag">Montag</option>
                  <option value="Dienstag">Dienstag</option>
                  <option value="Mittwoch">Mittwoch</option>
                  <option value="Donnerstag">Donnerstag</option>
                  <option value="Freitag">Freitag</option>
                </select>
            </td>
            <td>
                <input
              type='text'
             placeholder='Von'
              className = 'input-time'
              />
              <span>  </span> 
                <input
              type='text'
              placeholder='bis'
               className = 'input-time'
              />
               </td>
            <td>
              <input 
              type="text"  
              placeholder=''
              className='input-duration'
              />
              <span>min</span>
              </td>
              <td>
                <input 
                type="text" 
                placeholder='Ort'
                className='input-location'
                />
              </td>
              <td>
                <div className="new-student-buttons">
                  <button title='Speichern' className='btn-save'>
                    Speichern</button>
                  
                  <button title='Löschen' className='btn-delete'>
                    <IoCloseOutline className='icon icon-delete'/>
                  </button>
                </div>
                
              </td>
          </tr>
          </table>
          }
        
    </div>
  );
}