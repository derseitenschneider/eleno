import { TStudent } from '../../../../types/types'
import ButtonSort from '../../../ui/buttonSort/ButtonSort.component'
import Table from '../../../ui/table/Table.component'

interface StudentsTableProps {
  children: React.ReactNode
  isSelected: number[]
  setIsSelected: React.Dispatch<React.SetStateAction<number[]>>
  students: TStudent[]
}

function StudentsTable({
  children,
  isSelected,
  setIsSelected,
  students,
}: StudentsTableProps) {
  const selectedString = isSelected.sort((a, b) => a - b).join('-')
  const studentsString = students
    .map((student) => student.id)
    .sort((a, b) => a - b)
    .join('-')

  const allChecked = selectedString === studentsString && isSelected.length > 0

  const columns = '4rem repeat(3, 1fr) 11rem repeat(2, 7rem) 10rem  1fr 4rem'

  const handleAllCheckboxes = () => {
    if (allChecked) {
      setIsSelected([])
    }
    if (!allChecked) {
      setIsSelected(students.map((student) => student.id))
    }
  }

  return (
    <Table columns={columns}>
      <Table.Header>
        <div>
          <input
            type="checkbox"
            onChange={handleAllCheckboxes}
            checked={allChecked}
          />
        </div>
        <div>
          <span>Vorname</span>
        </div>
        <div>
          <span>Nachname</span>
          <ButtonSort name="lastName" />
        </div>
        <div>
          <span>Instrument</span>
          <ButtonSort name="instrument" />
        </div>
        <div>
          <span>Tag</span>
          <ButtonSort name="dayOfLesson" />
        </div>
        <div>
          <span>Von</span>
        </div>
        <div>
          <span>Bis</span>
        </div>
        <div>
          <span>Dauer</span>
          <ButtonSort name="durationMinutes" />
        </div>
        <div style={{ gridColumn: 'auto / span 2' }}>
          <span>Unterrichtsort</span>
          <ButtonSort name="location" />
        </div>
      </Table.Header>
      {children}
      {/* <Menus>
        <Table.Body
          data={students}
          render={(student) => (
            <Menus.Menu key={student.id}>
              <ActiveStudentRow student={student} />
            </Menus.Menu>
          )}
          emptyMessage="Keine aktiven Schüler:innen vorhanden"
        />
      </Menus> */}
    </Table>
  )
}

export default StudentsTable
