import './studentrow.styles.scss'
import { FunctionComponent, FunctionComponentElement, ReactComponentElement } from 'react';
import { TStudent } from '../../types/Students.type';
import { IconType } from 'react-icons/lib';

interface StudentRowProps {
  key: number,
  student: TStudent,
  form: boolean,
  buttons?: {
    label: string,
    icon: IconType,
    className?: string,
    handler: (e: React.MouseEvent) => void
  }[]
}
 
const StudentRow: FunctionComponent<StudentRowProps> = ({key, student, form, buttons}) => {
  return (  
     <tr key={key}>
            <td>
              <input type="checkbox" name="" id="" />
            </td>
            <td>
              {form && 
                <input
                type='text'
                value = {student.firstName}
                />}
                {!form && 
                  <span>{student.firstName}</span>
                }
              </td>
            <td>
              {form &&
                <input
                type='text'
                value = {student.lastName}
                />
              }
              {!form && <span>{student.lastName}</span>}
              </td>
            <td>
              {form && 
                <input
              type='text'
              value = {student.instrument}
              />
              }
              {!form  && <span>{student.instrument}</span>}
               
              </td>
              {form &&
              <>
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
              </>
              }
            
              <td className='td-buttons'>
                {
                  buttons?.map(button => 
                    <button
                    title={button.label}
                    onClick={button.handler}
                    className= {button.className}
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