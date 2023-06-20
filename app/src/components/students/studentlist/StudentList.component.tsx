import './studentList.style.scss'
import { FunctionComponent, SetStateAction, useState, useEffect } from 'react'
import { TSorting, TSortingMethods, TStudent } from '../../../types/types'
import { IoTriangle } from 'react-icons/io5'
import StudentRow from '../studentRow/StudentRow'
interface StudentListProps {
  students: TStudent[]
  sorting?: TSorting
  sort?: (method: TSortingMethods) => void
  isSelected: number[]
  setIsSelected?: React.Dispatch<SetStateAction<number[]>>
  isArchive: boolean
}

const StudentList: FunctionComponent<StudentListProps> = ({
  students,
  sorting,
  sort,
  isArchive,
  isSelected,
  setIsSelected,
}) => {
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    if (isSelected.length !== students.length) {
      setIsChecked(false)
    }
  }, [isSelected])

  const handlerCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked((prev) => !prev)
    if (e.target.checked) {
      const newArr = students.map((student) => student.id)
      setIsSelected(newArr)
    }

    if (!e.target.checked) {
      setIsSelected([])
    }
  }

  return (
    <div className="student-list">
      {/*Head row*/}
      <div className="grid-row grid-row--header">
        <div className="student-list__header">
          <input type="checkbox" checked={isChecked} onChange={handlerCheck} />
        </div>
        <div className="student-list__header">
          <span>Vorname</span>
        </div>
        <div className="student-list__header">
          <span>Nachname</span>
          {!isArchive && (
            <button
              style={
                sorting?.method === 'lastName' && !sorting.ascending
                  ? { transform: 'rotate(0)' }
                  : {}
              }
              className={`button--sort ${
                sorting?.method === 'lastName' ? 'active' : ''
              }`}
              onClick={() => {
                sort('lastName')
              }}
            >
              <IoTriangle />
            </button>
          )}
        </div>
        <div className="student-list__header">
          <span>Instrument</span>
          {!isArchive && (
            <button
              style={
                sorting?.method === 'instrument' && !sorting.ascending
                  ? { transform: 'rotate(0)' }
                  : {}
              }
              className={`button--sort ${
                sorting?.method === 'instrument' ? 'active' : ''
              }`}
              onClick={() => {
                sort('instrument')
              }}
            >
              <IoTriangle />
            </button>
          )}
        </div>
        <div className="student-list__header">
          <span>Tag</span>
          {!isArchive && (
            <button
              style={
                sorting?.method === 'dayOfLesson' && !sorting.ascending
                  ? { transform: 'rotate(0)' }
                  : {}
              }
              className={`button--sort ${
                sorting?.method === 'dayOfLesson' ? 'active' : ''
              }`}
              onClick={() => {
                sort('dayOfLesson')
              }}
            >
              <IoTriangle />
            </button>
          )}
        </div>
        <div className="student-list__header">Von</div>
        <div className="student-list__header">Bis</div>
        <div className="student-list__header">
          <span>Dauer</span>
          {!isArchive && (
            <button
              style={
                sorting?.method === 'duration' && !sorting.ascending
                  ? { transform: 'rotate(0)' }
                  : {}
              }
              className={`button--sort ${
                sorting?.method === 'duration' ? 'active' : ''
              }`}
              onClick={() => {
                sort('duration')
              }}
            >
              <IoTriangle />
            </button>
          )}
        </div>
        <div className="student-list__header">
          <span>Unterrichtsort</span>
          {!isArchive && (
            <button
              style={
                sorting?.method === 'location' && !sorting.ascending
                  ? { transform: 'rotate(0)' }
                  : {}
              }
              className={`button--sort ${
                sorting?.method === 'location' ? 'active' : ''
              }`}
              onClick={() => {
                sort('location')
              }}
            >
              <IoTriangle />
            </button>
          )}
        </div>
        <div className="student-list__header"></div>
      </div>

      {students.map((student) => (
        <StudentRow
          studentId={student.id}
          key={student.id}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isArchive={isArchive}
        />
      ))}
    </div>
  )
}

export default StudentList
