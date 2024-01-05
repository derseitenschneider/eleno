import { HiArchive } from 'react-icons/hi'
import { MdRestore } from 'react-icons/md'

import './studentsActive.style.scss'

import { IoAddOutline } from 'react-icons/io5'
import { HiOutlineDocumentArrowDown, HiPencil } from 'react-icons/hi2'

import { createContext, useContext, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { toast } from 'react-toastify'
import { useStudents } from '../../../../services/context/StudentContext'

import { TSorting } from '../../../../types/types'
import { sortStudents } from '../../../../utils/sortStudents'

import Button from '../../../ui/button/Button.component'

import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import SearchBar from '../../../ui/searchBar/SearchBar.component'

import Menus from '../../../ui/menu/Menus.component'
import Modal from '../../../ui/modal/Modal.component'
import Table from '../../../ui/table/Table.component'
import AddStudents from '../addStudents/AddStudents.component'
import ResetStudents from '../resetStudents/ResetStudents.component'
import StudentsTable from '../studentsTable/StudentsTable.component'
import ActiveStudentRow from './ActiveStudentRow.component'
import ExportStudentList from '../exportStudentList/ExportStudentList.component'
import Select from '../../../ui/select/Select.component'
import BulkExportLessons from '../../lessons/bulkExportLessons/BulkExportLessons.component'

import EditStudents from '../editStudents/EditStudents.component'

type ContextTypeActiveStudents = {
  selectedStudents: number[]
  setSelectedStudents: React.Dispatch<React.SetStateAction<number[]>>
}

const ActiveStudentsContext = createContext<ContextTypeActiveStudents>(null)

export default function ActiveStudents() {
  const { deactivateStudents, activeStudents } = useStudents()
  const [searchInput, setSearchInput] = useState('')
  const [action, setAction] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])

  const [searchParams, setSearchParams] = useSearchParams()

  const filteredStudents = activeStudents?.filter(
    (student) =>
      student.firstName
        .toLowerCase()
        .includes(searchInput.toLowerCase().split(' ').join('')) ||
      student.lastName
        .toLowerCase()
        .includes(searchInput.toLowerCase().split(' ').join('')) ||
      `${student.firstName.toLowerCase()}${student.lastName.toLowerCase()}`.includes(
        searchInput.toLowerCase().split(' ').join(''),
      ) ||
      student.instrument
        .toLowerCase()
        .includes(searchInput.toLowerCase().split(' ').join('')) ||
      student.location
        .toLowerCase()
        .includes(searchInput.toLowerCase().split(' ').join('')) ||
      student.dayOfLesson
        .toLowerCase()
        .includes(searchInput.toLowerCase().split(' ').join('')),
  )

  const handlerSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setSearchInput(input)
  }
  const sorting: TSorting = {
    sort: searchParams.get('sort'),
    ascending: searchParams.get('asc'),
  }

  const sortedStudents = sortStudents(filteredStudents, sorting)

  const handlerAction = async () => {
    if (action === 'Bearbeiten') {
      searchParams.set('modal', 'bulk-edit-students')
      setSearchParams(searchParams)
      setAction('')
    }
    if (action === 'Archivieren') {
      try {
        await deactivateStudents(selectedStudents)
        toast(
          `Schüler:in${selectedStudents.length > 1 ? 'nen' : ''} archiviert`,
        )
        setAction('')
        setSelectedStudents([])
      } catch (error) {
        fetchErrorToast()
      }
    }

    if (action === 'Zurücksetzen') {
      searchParams.set('modal', 'reset-students')
      setSearchParams(searchParams)
      setAction('')
    }
    if (action === 'Lektionsliste exportieren') {
      searchParams.set('modal', 'bulk-export-lessons')
      setSearchParams(searchParams)
      setAction('')
    }
  }
  const value = useMemo(
    () => ({ selectedStudents, setSelectedStudents }),
    [selectedStudents],
  )
  return (
    <ActiveStudentsContext.Provider value={value}>
      <div className="students">
        <div className="header">
          <div className="container--heading">
            <span>Aktive Schüler:innen: {activeStudents.length}</span>
          </div>

          <div className="container--controls">
            <Select
              selected={action}
              setSelected={setAction}
              label="Aktion"
              disabled={selectedStudents.length === 0}
              options={[
                { name: 'Bearbeiten', icon: <HiPencil /> },
                { name: 'Archivieren', icon: <HiArchive /> },
                { name: 'Zurücksetzen', icon: <MdRestore /> },
                {
                  name: 'Lektionsliste exportieren',
                  icon: <HiOutlineDocumentArrowDown />,
                },
              ]}
            />

            {action && selectedStudents.length ? (
              <Button
                label="Anwenden"
                btnStyle="primary"
                type="button"
                handler={handlerAction}
                size="sm"
              />
            ) : null}

            <Modal>
              <Modal.Open opens="bulk-edit-students" />
              <Modal.Window name="bulk-edit-students">
                <EditStudents
                  studentIds={selectedStudents}
                  setSelectedStudents={setSelectedStudents}
                />
              </Modal.Window>
            </Modal>

            <Modal>
              <Modal.Open opens="reset-students" />
              <Modal.Window name="reset-students">
                <ResetStudents />
              </Modal.Window>
            </Modal>

            <Modal>
              <Modal.Open opens="bulk-export-lessons" />
              <Modal.Window name="bulk-export-lessons">
                <BulkExportLessons />
              </Modal.Window>
            </Modal>

            <div className="container-right">
              <Modal>
                <Modal.Open opens="export-student-list">
                  <Button
                    btnStyle="secondary"
                    type="button"
                    icon={<HiOutlineDocumentArrowDown />}
                    size="sm"
                  >
                    Exportieren
                  </Button>
                </Modal.Open>

                <Modal.Window name="export-student-list">
                  <ExportStudentList students={sortedStudents} />
                </Modal.Window>
              </Modal>
              <SearchBar
                searchInput={searchInput}
                handlerSearchInput={handlerSearchInput}
              />

              <Modal>
                <Modal.Open opens="add-students">
                  <Button
                    btnStyle="primary"
                    type="button"
                    size="sm"
                    icon={<IoAddOutline />}
                  >
                    Neu
                  </Button>
                </Modal.Open>
                <Modal.Window name="add-students">
                  <AddStudents />
                </Modal.Window>
              </Modal>
            </div>
          </div>
        </div>
        <StudentsTable
          isSelected={selectedStudents}
          setIsSelected={setSelectedStudents}
          students={sortedStudents}
        >
          <Menus>
            <Table.Body
              data={sortedStudents}
              render={(student) => (
                <Menus.Menu key={student.id}>
                  <ActiveStudentRow student={student} />
                </Menus.Menu>
              )}
              emptyMessage="Keine aktiven Schüler:innen vorhanden"
            />
          </Menus>
        </StudentsTable>
      </div>
    </ActiveStudentsContext.Provider>
  )
}

export const useActiveStudents = () => {
  const context = useContext(ActiveStudentsContext)
  return context
}
