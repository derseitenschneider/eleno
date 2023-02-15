import './studentrow.styles.scss'

interface StudentRowProps {
 
}
 
const StudentRow: FunctionComponent<StudentRowProps> = () => {
  return ( 
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
   );
}
 
export default StudentRow;