import { useState } from 'react'
import { HiArchive, HiPencil } from 'react-icons/hi'
import { HiOutlineListBullet } from 'react-icons/hi2'
import { IoCheckboxOutline, IoSchool } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { TStudent } from '../../../../types/types'
import Menus from '../../../ui/menu/Menus.component'
import Table from '../../../ui/table/Table.component'

import { useStudents } from '../../../../services/context/StudentContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import Modal from '../../../ui/modal/Modal.component'
import Repertoire from '../../repertoire/Repertoire.component'
import AddTodo from '../../todos/addTodo/AddTodo.component'
import EditStudent from '../editStudents/EditStudent.component'
import { useActiveStudents } from './ActiveStudents.component'

interface ActiveStudentRowProps {
  student: TStudent
  openId?: number
}

function ActiveStudentRow({ student, openId }: ActiveStudentRowProps) {
  const { deactivateStudents, setCurrentStudentIndex, activeSortedStudentIds } =
    useStudents()
  const [isPending, setIsPending] = useState(false)
  const { isSelected, setIsSelected } = useActiveStudents()

  const navigate = useNavigate()

  const handleNavigateToStudent = () => {
    const studentIndex = activeSortedStudentIds.indexOf(student.id)
    setCurrentStudentIndex(studentIndex)
    navigate('/lessons')
  }

  const handleArchivate = async () => {
    setIsPending(true)
    try {
      await deactivateStudents([student.id])
      toast('Schüler:in archiviert')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  const handleCheckbox = () => {
    if (isSelected.includes(student.id)) {
      setIsSelected((prev) =>
        prev.filter((studentId) => studentId !== student.id),
      )
    }
    if (!isSelected.includes(student.id)) {
      setIsSelected((prev) => [...prev, student.id])
    }
  }

  return (
    <Table.Row
      className={isPending ? 'loading' : ''}
      styles={
        openId === student.id
          ? {
              color: 'var(--clr-primary-600)',
              boxShadow:
                'inset 3px 0 0 var(--clr-primary-400), inset -3px 0 0 var(--clr-primary-400)',
            }
          : null
      }
    >
      <div>
        <input
          type="checkbox"
          checked={isSelected.includes(student.id)}
          onChange={handleCheckbox}
        />
      </div>
      <div>
        <span>{student.firstName}</span>
      </div>
      <div>
        <span>{student.lastName}</span>
      </div>
      <div>
        <span>{student.instrument}</span>
      </div>
      <div>
        <span>{student.dayOfLesson}</span>
      </div>
      <div>
        <span>{student.startOfLesson}</span>
      </div>
      <div>
        <span>{student.endOfLesson}</span>
      </div>
      <div>
        <span>{student.durationMinutes}</span>
      </div>
      <div>
        <span>{student.location}</span>
      </div>
      <div>
        <Modal>
          <Menus.Toggle id={student.id} />

          <Menus.List id={student.id}>
            <Modal.Open opens="edit-student">
              <Menus.Button icon={<HiPencil />}>Bearbeiten</Menus.Button>
            </Modal.Open>

            <Menus.Button icon={<IoSchool />} onClick={handleNavigateToStudent}>
              Zum Unterrichtsblatt
            </Menus.Button>

            <Modal.Open opens="add-todo">
              <Menus.Button icon={<IoCheckboxOutline />}>
                Todo erfassen
              </Menus.Button>
            </Modal.Open>

            <Modal.Open opens="repertoire">
              <Menus.Button icon={<HiOutlineListBullet />}>
                Repertoire
              </Menus.Button>
            </Modal.Open>

            <Menus.Button icon={<HiArchive />} onClick={handleArchivate}>
              Archivieren
            </Menus.Button>
          </Menus.List>

          <Modal.Window name="edit-student">
            <EditStudent studentId={student.id} />
          </Modal.Window>

          <Modal.Window name="add-todo">
            <AddTodo studentId={student.id} />
          </Modal.Window>

          <Modal.Window name="repertoire">
            <Repertoire studentId={student.id} />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  )
}

export default ActiveStudentRow
