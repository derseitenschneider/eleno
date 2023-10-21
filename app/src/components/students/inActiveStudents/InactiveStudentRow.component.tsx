import { FC, useState } from 'react'
import { TStudent } from '../../../types/types'
import Table from '../../common/table/Table.component'
import Menus from '../../common/menu/Menus.component'
import { HiTrash } from 'react-icons/hi'

import { IoReturnDownBackOutline } from 'react-icons/io5'
import Modal from '../../common/modal/Modal.component'

import { useStudents } from '../../../contexts/StudentContext'
import { toast } from 'react-toastify'
import fetchErrorToast from '../../../hooks/fetchErrorToast'

import { useInactiveStudents } from './InactiveStudents.component'
import DeleteStudents from '../deleteStudents/DeleteStudents.component'

interface InactiveStudentRowProps {
  student: TStudent
  openId?: number
}

const InachtiveStudentRow: FC<InactiveStudentRowProps> = ({
  student,
  openId,
}) => {
  const { reactivateStudents } = useStudents()
  const [isPending, setIsPending] = useState(false)
  const { isSelected, setIsSelected } = useInactiveStudents()

  const handleReactivate = async () => {
    setIsPending(true)
    try {
      await reactivateStudents([student.id])
      toast('Schüler:in wiederhergestellt')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  const handleCheckbox = () => {
    if (isSelected.includes(student.id)) {
      setIsSelected((prev) =>
        prev.filter((studentId) => studentId !== student.id)
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
            <Menus.Button
              icon={<IoReturnDownBackOutline />}
              onClick={handleReactivate}
            >
              Wiederherstellen
            </Menus.Button>

            <Modal.Open opens="delete-student">
              <Menus.Button icon={<HiTrash />} iconColor="var(--clr-warning)">
                Löschen
              </Menus.Button>
            </Modal.Open>
          </Menus.List>

          <Modal.Window name="delete-student">
            <DeleteStudents studentIds={[student.id]} />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  )
}

export default InachtiveStudentRow
