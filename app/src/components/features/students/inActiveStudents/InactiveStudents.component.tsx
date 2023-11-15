// Hooks
// Components
import { createContext, useContext, useMemo, useState } from 'react'

import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { TSorting } from '../../../../types/types'
import { sortStudents } from '../../../../utils/sortStudents'
import Menus from '../../../ui/menu/Menus.component'
import Table from '../../../ui/table/Table.component'
import StudentsTable from '../studentsTable/StudentsTable.component'

import Button from '../../../ui/button/Button.component'
import { useStudents } from '../../../../services/context/StudentContext'
import Modal from '../../../ui/modal/Modal.component'
import SearchBar from '../../../ui/searchBar/SearchBar.component'
import DeleteStudents from '../deleteStudents/DeleteStudents.component'
import InachtiveStudentRow from './InactiveStudentRow.component'

type ContextTypeInactiveStudents = {
  isSelected: number[]
  setIsSelected: React.Dispatch<React.SetStateAction<number[]>>
}

const InactiveStudentsContext = createContext<ContextTypeInactiveStudents>(null)

function InactiveStudents() {
  const { reactivateStudents, inactiveStudents } = useStudents()
  const [isSelected, setIsSelected] = useState<number[]>([])
  const [inputAction, setInputAction] = useState<number>(0)
  const [searchInput, setSearchInput] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()

  const filteredStudents = inactiveStudents?.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchInput) ||
      student.lastName.toLocaleLowerCase().includes(searchInput) ||
      student.instrument.toLocaleLowerCase().includes(searchInput) ||
      student.location.toLocaleLowerCase().includes(searchInput) ||
      student.dayOfLesson.toLocaleLowerCase().includes(searchInput),
  )

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
        await reactivateStudents(isSelected)
        toast(
          `Schüler:in${isSelected.length > 1 ? 'nen' : ''} wiederhergestellt`,
        )
        setInputAction(0)
        setIsSelected([])
      } catch (error) {
        fetchErrorToast()
      }
    }

    if (inputAction === 2) {
      searchParams.append('modal', 'multi-delete-students')
      setSearchParams(searchParams)

      setInputAction(0)
    }
  }
  const value = useMemo(
    () => ({
      isSelected,
      setIsSelected,
    }),
    [isSelected],
  )

  return (
    <InactiveStudentsContext.Provider value={value}>
      <div className="students">
        <div className="header">
          <div className="container--heading">
            <span>Archivierte Schüler:innen: {inactiveStudents.length}</span>
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
              <option value={1}>Wiederherstellen</option>
              <option value={2}>Löschen</option>
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
              <Modal.Open opens="multi-delete-students" />
              <Modal.Window name="multi-delete-students">
                <DeleteStudents />
              </Modal.Window>
            </Modal>

            <div className="container-right">
              <SearchBar
                searchInput={searchInput}
                handlerSearchInput={(e) =>
                  setSearchInput(e.target.value.toLowerCase())
                }
              />
            </div>
          </div>
        </div>

        <StudentsTable
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          students={filteredStudents}
        >
          <Menus>
            <Table.Body
              data={sortedStudents}
              render={(student) => (
                <Menus.Menu key={student.id}>
                  <InachtiveStudentRow student={student} />
                </Menus.Menu>
              )}
              emptyMessage="Keine archivierten Schüler:innen vorhanden"
            />
          </Menus>
        </StudentsTable>
      </div>
    </InactiveStudentsContext.Provider>
  )
}

export default InactiveStudents

export const useInactiveStudents = () => {
  const context = useContext(InactiveStudentsContext)
  return context
}
