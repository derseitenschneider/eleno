import './studentrow.styles.scss'
import { FunctionComponent, FunctionComponentElement, ReactComponentElement } from 'react';
import { TStudent } from '../../types/Students.type';
import { IconType } from 'react-icons/lib';

interface StudentRowProps {
  student: TStudent,
  buttons?: {
    label: string,
    icon: IconType,
    handler: (e: React.MouseEvent) => void
  }[]
}
 
const StudentRow: FunctionComponent<StudentRowProps> = ({student, buttons}) => {
  return (  
     <tr key={student.id}>
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
                {
                  buttons.map(button => 
                    <button
                    title={button.label}
                    onClick={button.handler}
                    data-id = {student.id}
                    >
                      <button.icon className='icon'/>
                    </button>
                    )
                }

                {/* <button title='Unterrichtsblatt'>
                  <IoSchoolOutline className='icon icon-lessons'/></button>
                <button 
                title='Archivieren' 
                onClick={handlerArchive}
                data-id={student.id}
                >
                  <IoTrashOutline className='icon icon-trash'/>
                </button>                 */}
              </td>
          </tr>
  );
}
 
export default StudentRow;