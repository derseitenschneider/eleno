import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { HiTrash } from 'react-icons/hi'
import {
  HiOutlineDocumentArrowDown,
  HiOutlineListBullet,
} from 'react-icons/hi2'
import { IoReturnDownBackOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { TStudent } from '../../../../types/types'
import Menus from '../../../ui/menu/Menus.component'
import Table from '../../../ui/table/Table.component'

import Modal from '../../../ui/modal/Modal.component'

import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { useStudents } from '../../../../services/context/StudentContext'

import DeleteStudents from '../deleteStudents/DeleteStudents.component'
import { useInactiveStudents } from './InactiveStudents.component'
import ExportLessons from '../../lessons/exportLessons/ExportLessons.component'

interface InactiveStudentRowProps {
  student: TStudent
  openId?: number
}

function InachtiveStudentRow({ student, openId }: InactiveStudentRowProps) {
  const { reactivateStudents } = useStudents()
  const [isPending, setIsPending] = useState(false)
  const { isSelected, setIsSelected } = useInactiveStudents()
  const navigate = useNavigate()

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
        prev.filter((studentId) => studentId !== student.id),
      )
    }
    if (!isSelected.includes(student.id)) {
      setIsSelected((prev) => [...prev, student.id])
    }
  }

  const navigateRepertoire = () => {
    navigate(`/lessons/repertoire?studentId=${student.id}`)
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

            <Menus.Button
              icon={<HiOutlineListBullet />}
              onClick={navigateRepertoire}
            >
              Repertoire
            </Menus.Button>

            <Modal.Open opens="export-lessons">
              <Menus.Button icon={<HiOutlineDocumentArrowDown />}>
                Lektionsliste exportieren
              </Menus.Button>
            </Modal.Open>

            <Modal.Open opens="delete-student">
              <Menus.Button icon={<HiTrash />} iconColor="var(--clr-warning)">
                Löschen
              </Menus.Button>
            </Modal.Open>
          </Menus.List>

          <Modal.Window name="export-lessons">
            <ExportLessons studentId={student.id} />
          </Modal.Window>

          <Modal.Window name="delete-student">
            <DeleteStudents studentIds={[student.id]} />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  )
}

export default InachtiveStudentRow
