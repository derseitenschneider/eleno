import { ChangeEvent, MouseEventHandler, useEffect, useState } from 'react';
import { useStudents } from '../../../Application';
import { IoTrashOutline } from 'react-icons/io5';
import { IoPersonAddOutline } from 'react-icons/io5';
import { IoSearchOutline } from 'react-icons/io5';
import { IoCloseOutline } from 'react-icons/io5';
import { IoSchoolOutline } from "react-icons/io5";
import './studentlist.styles.scss'

import {archiveStudent} from '../../../supabase/supabase'

import StudentRow from '../../../components/studentRow/StudentRow';



export default function StudentList() {
  const {students, setStudents}  = useStudents()
  const [searchInput, setSearchInput] = useState('');
  const [newStudentRowOpen, setNewStudentRowOpen] = useState(false)

  const toggleNewStudentOpen = () => {
    setNewStudentRowOpen(!newStudentRowOpen)
  }
  const addStudentEventHandler = () => {
    toggleNewStudentOpen();
  }

  const onChangeHandlerInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value.toLowerCase());
  }

  const handlerArchive = (e:React.MouseEvent) => {
    const target = e.target as Element
    const id = +target.closest('button').dataset.id
    const newStudents = students.filter(student => student.id !== id)
    setStudents([...newStudents])

    archiveStudent(id);
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
          <th>
            <input type="checkbox" />
          </th>
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
          {
            filteredStudents
            .filter(student => !student.archive)
            .map(student => 
            <StudentRow 
            student={student}
            buttons={
              [
                {
                  label: 'Unterrichtsblatt',
                  icon: IoSchoolOutline,
                  handler: () => {}
                },
                {label: 'Archivieren',
                icon: IoTrashOutline,
                handler: handlerArchive
                }
              ]
            }
            />
            )
          }       
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
              
                  
                  <button 
                  title='Löschen' 
                  className='btn-delete' 
                  onClick={toggleNewStudentOpen}
                  >
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