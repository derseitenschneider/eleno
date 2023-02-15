import { useEffect, useState } from 'react';
import { useStudents } from '../../../Application';
import { IoTrashOutline } from 'react-icons/io5';
import { IoPersonAddOutline } from 'react-icons/io5';
import { IoSearchOutline } from 'react-icons/io5';
import { IoCloseOutline } from 'react-icons/io5';
import { IoSchoolOutline } from "react-icons/io5";
import './studentlist.styles.scss'



export default function StudentList() {
  const {students}  = useStudents()
  const [searchInput, setSearchInput] = useState('');
  const [newStudentRowOpen, setNewStudentRowOpen] = useState(false)

  const toggleNewStudentOpen = () => {
    setNewStudentRowOpen(!newStudentRowOpen)
  }
  const addStudentEventHandler = () => {
    toggleNewStudentOpen();
  }

  const onChangeHandlerInput = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  }

  const filteredStudents = students.filter(student => student.firstName.toLowerCase().includes(searchInput) || 
  student.lastName.toLocaleLowerCase().includes(searchInput) ||
  student.instrument.toLocaleLowerCase().includes(searchInput) ||
  student.location.toLocaleLowerCase().includes(searchInput) ||
  student.dayOfLesson.toLocaleLowerCase().includes(searchInput))



  return (
    <div className='student-list'>
      <div className="heading">
        <select name="" id="" defaultValue='Aktion'>
          <option disabled hidden >Aktion</option>
          <option value='archive' >Archivieren</option>
          <option value="delete">Löschen</option>
        </select>
        <div className="container-right">
            <IoSearchOutline className='icon icon-search'/>
            <input 
            type="search" 
            placeholder='suchen'
            value = {searchInput}
            onChange={onChangeHandlerInput}
            />
            <button 
            title='Schüler:in erfassen'
            onClick={addStudentEventHandler}
            className={`button-add-student ${newStudentRowOpen && 'disabled'}`}>
              <span>Neu</span>

              <IoPersonAddOutline className='icon icon-add'/>
            </button>
        </div>
        </div>
      
      <table className='student-list-table'>
        <thead>
        <tr>
          <th></th>
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
        {filteredStudents.filter(student => !student.archive).map(student =>
          <tr>
            <td>
              <input type="checkbox" name="" id="" />
            </td>
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

                <button title='Unterrichtsblatt'><IoSchoolOutline className='icon icon-lessons'/></button>
                <button title='Archivieren'><IoTrashOutline className='icon icon-trash'/></button>                
              </td>
          </tr>
          )}

        
          </tbody>
      </table>

        {newStudentRowOpen && 
        <div>
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
             placeholder='von'
              className = 'input-time'
              />
              <span> - </span> 
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
              
                  
                  <button title='Löschen' className='btn-delete' onClick={toggleNewStudentOpen}>
                    <IoCloseOutline className='icon icon-delete'/>
                  </button>
                </div>
                
              </td>
          </tr>
          </table>
          <button title='Speichern' className='btn-save'>Speichern</button>
          </div>
          }
        
    </div>
  );
}