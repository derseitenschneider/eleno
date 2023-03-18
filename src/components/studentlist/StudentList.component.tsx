import './studentList.style.scss'
import { FunctionComponent, useState } from 'react'
import { TStudent } from '../../types/types'
import { IoEllipsisVertical } from 'react-icons/io5'
import DropDown from '../dropdown/Dropdown.component'
import StudentRow from '../studentRow/StudentRow'
interface StudentListProps {
  students: TStudent[]
}

const StudentList: FunctionComponent<StudentListProps> = ({ students }) => {
  return (
    <div className="student-list">
      {/*Head row*/}
      <div className="student-list__header">
        <input type="checkbox" />
      </div>
      <div className="student-list__header">Nachname</div>
      <div className="student-list__header">Vorname</div>
      <div className="student-list__header">Instrument</div>
      <div className="student-list__header">Tag</div>
      <div className="student-list__header">Von</div>
      <div className="student-list__header">Bis</div>
      <div className="student-list__header">Dauer</div>
      <div className="student-list__header">Unterrichtsort</div>
      <div className="student-list__header"></div>

      {students.map((student) => (
        <StudentRow student={student} key={student.id} />
        // <>
        //   <div className="checkbox">
        //     <input type="checkbox" />
        //   </div>
        //   <div>{student.firstName}</div>
        //   <div>{student.lastName}</div>
        //   <div>{student.instrument}</div>
        //   <div>{student.dayOfLesson}</div>
        //   <div>{student.startOfLesson}</div>
        //   <div>{student.endOfLesson}</div>
        //   <div>{student.durationMinutes} Minuten</div>
        //   <div>{student.location}</div>
        //   <div>
        //     <button className="button--edit" data-id={student.id}>
        //       <IoEllipsisVertical />
        //     </button>
        //     {dropdownOpen && (
        //       <DropDown
        //         positionX="right"
        //         positionY="bottom"
        //         buttons={[
        //           {
        //             label: 'Schüler:in bearbeiten',
        //             handler: () => {},
        //             type: 'normal',
        //           },
        //         ]}
        //       />
        //     )}
        //   </div>
        // </>
      ))}
    </div>
  )
}

export default StudentList
