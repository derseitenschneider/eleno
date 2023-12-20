import './studentsActive.style.scss'

import { IoAddOutline } from 'react-icons/io5'
import { HiOutlineDocumentArrowDown } from 'react-icons/hi2'

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

type ContextTypeActiveStudents = {
  isSelected: number[]
  setIsSelected: React.Dispatch<React.SetStateAction<number[]>>
}

const ActiveStudentsContext = createContext<ContextTypeActiveStudents>(null)

export default function ActiveStudents() {
  const { deactivateStudents, activeStudents } = useStudents()
  const [searchInput, setSearchInput] = useState('')

  const [isSelected, setIsSelected] = useState<number[]>([])
  const [inputAction, setInputAction] = useState<number>(0)

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

  const onChangeAction = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputAction(+e.target.value)
  }

  const handlerAction = async () => {
    if (inputAction === 1) {
      try {
        await deactivateStudents(isSelected)
        toast(`Schüler:in${isSelected.length > 1 ? 'nen' : ''} archiviert`)
        setInputAction(0)
        setIsSelected([])
      } catch (error) {
        fetchErrorToast()
      }
    }

    if (inputAction === 2) {
      searchParams.set('modal', 'reset-students')
      setSearchParams(searchParams)
      setInputAction(0)
    }
  }
  const value = useMemo(() => ({ isSelected, setIsSelected }), [isSelected])
  return (
    <ActiveStudentsContext.Provider value={value}>
      <div className="students">
        <div className="header">
          <div className="container--heading">
            <span>Aktive Schüler:innen: {activeStudents.length}</span>
          </div>

          <div className="container--controls">
            <select
              className="select-action"
              onChange={onChangeAction}
              value={inputAction}
              disabled={isSelected.length === 0}
            >
              <option disabled hidden value={0}>
                Aktion
              </option>
              <option value={1}>Archivieren</option>
              <option value={2}>Zurücksetzen</option>
            </select>
            {inputAction && isSelected.length ? (
              <Button
                label="Anwenden"
                btnStyle="primary"
                type="button"
                handler={handlerAction}
              />
            ) : null}

            <Modal>
              <Modal.Open opens="reset-students" />
              <Modal.Window name="reset-students">
                <ResetStudents />
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
          isSelected={isSelected}
          setIsSelected={setIsSelected}
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
