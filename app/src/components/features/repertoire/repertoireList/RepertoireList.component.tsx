import { HiArrowSmLeft } from 'react-icons/hi'
import { HiOutlineDocumentArrowDown } from 'react-icons/hi2'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Table from '../../../ui/table/Table.component'
import './repertoireList.style.scss'

import { TSorting } from '../../../../types/types'
import sortRepertoire from '../../../../utils/sortRepertoire'
import ButtonSort from '../../../ui/buttonSort/ButtonSort.component'
import SearchBar from '../../../ui/searchBar/SearchBar.component'
import RepertoireItem from '../RepertoireItem.component'

import { useRepertoire } from '../../../../services/context/RepertoireContext'
import { useStudents } from '../../../../services/context/StudentContext'
import Button from '../../../ui/button/Button.component'
import Loader from '../../../ui/loader/Loader'
import Menus from '../../../ui/menu/Menus.component'
import Modal from '../../../ui/modal/Modal.component'
import AddRepertoireItem from '../addRepertoireItem/AddRepertoireItem.component'
import ExportRepertoire from '../exportRepertoire/ExportRepertoire.component'

type TRepertoireProps = {
  studentId: number
}

function RepertoireList({ studentId }: TRepertoireProps) {
  const { repertoire, isLoading, getRepertoire } = useRepertoire()

  const [searchParams] = useSearchParams()
  const [sorting, setSorting] = useState<TSorting>({
    sort: 'startDate',
    ascending: null,
  })
  const [searchInput, setSearchInput] = useState('')
  const { students, activeSortedStudentIds, setCurrentStudentIndex } =
    useStudents()

  const isActiveStudent = !!activeSortedStudentIds.find(
    (el) => el === studentId,
  )

  const navigate = useNavigate()

  const currentStudent = students.find((student) => student.id === studentId)

  useEffect(() => {
    getRepertoire(studentId)
  }, [getRepertoire, studentId])

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  useEffect(() => {
    const sortBy = searchParams.get('sort')
    const ascending = searchParams.get('asc')

    if (!sortBy) {
      setSorting({
        sort: 'startDate',
        ascending: null,
      })
    } else {
      setSorting({
        sort: sortBy,
        ascending,
      })
    }
  }, [searchParams])

  const filteredRepertoire = repertoire.filter((song) =>
    song.title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()),
  )

  const sortedFilteredRepertoire = sortRepertoire(
    filteredRepertoire,
    sorting,
  ).filter((item) => item.studentId === currentStudent.id)

  const handleNavigate = () => {
    const studentIndex = activeSortedStudentIds.indexOf(studentId)
    setCurrentStudentIndex(studentIndex)
    navigate('/lessons')
  }

  return (
    <motion.div
      className="repertoire-list container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {isActiveStudent && (
        <button type="button" className="link-back" onClick={handleNavigate}>
          <HiArrowSmLeft />
          <span>Zur Lektion</span>
        </button>
      )}
      <div className="header">
        <h2 className="heading-2">
          Repetoire {currentStudent.firstName} {currentStudent.lastName}
        </h2>
      </div>

      <AddRepertoireItem studentId={studentId} />
      {repertoire.length > 0 && (
        <div className="controls">
          <span className="count">Anzahl Songs: {repertoire.length}</span>

          <Modal>
            <Modal.Open opens="export">
              <Button
                type="button"
                btnStyle="secondary"
                icon={<HiOutlineDocumentArrowDown />}
                size="sm"
              >
                Exportieren
              </Button>
            </Modal.Open>

            <Modal.Window name="export">
              <ExportRepertoire repertoire={sortedFilteredRepertoire} />
            </Modal.Window>
          </Modal>
          <SearchBar
            searchInput={searchInput}
            handlerSearchInput={handleSearchInput}
          />
        </div>
      )}

      <Table columns="1fr repeat(2, 10ch) 4rem">
        <Table.Header>
          <div>
            <span>Song</span>
            <ButtonSort name="title" direction="asc" />
          </div>
          <div>
            <span>Start</span>
            <ButtonSort name="startDate" direction="desc" />
          </div>
          <div>
            <span>Ende</span>
            <ButtonSort name="endDate" direction="desc" />
          </div>
          <div />
        </Table.Header>
        {isLoading ? (
          <Loader loading={isLoading} />
        ) : (
          <Menus>
            <Table.Body
              data={sortedFilteredRepertoire}
              emptyMessage="Keine Songs gefunden"
              render={(item) => <RepertoireItem key={item.id} item={item} />}
            />
          </Menus>
        )}
      </Table>
    </motion.div>
  )
}

export default RepertoireList
