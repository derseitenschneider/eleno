import { useState } from 'react';
import { useStudents } from '../../../Application';
import { IoTrashOutline } from 'react-icons/io5';
import { IoPersonAddOutline } from 'react-icons/io5';
import { IoSearchOutline } from 'react-icons/io5';
import './studentlist.styles.css'



export default function StudentList() {
  const {students}  = useStudents()


  return (
    <div>
      <div className="heading">
        <h1>Schülerliste</h1>
        <div className="container-right">
            <IoSearchOutline className='icon icon-search'/>
                <input type="search" placeholder='suchen'/>
            <button>
              <IoPersonAddOutline className='icon icon-add'/>
            </button>
        </div>
        
    
        </div>
      
      <table>
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
                <button><IoTrashOutline className='icon icon-trash'/></button>
                
              </td>
          </tr>
          )}
          </tbody>
      </table>
        
    </div>
  );
}