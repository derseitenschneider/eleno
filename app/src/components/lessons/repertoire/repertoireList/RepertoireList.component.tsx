import Table from '../../../common/table/Table.component'
import './repertoireList.style.scss'

import { useEffect, useState } from 'react'
import ButtonSort from '../../../common/buttonSort/ButtonSort.component'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../../../common/searchBar/SearchBar.component'
import RepertoireItem from '../RepertoireItem.component'
import { TSorting } from '../../../../types/types'
import { sortRepertoire } from '../../../../utils/sortRepertoire'

import AddRepertoireItem from '../addRepertoireItem/AddRepertoireItem.component'
import { useStudents } from '../../../../contexts/StudentContext'
import { useRepertoire } from '../../../../contexts/RepertoireContext'
import Loader from '../../../common/loader/Loader'
import Menus from '../../../common/menu/Menus.component'

import { motion } from 'framer-motion'

type TRepertoireProps = {
  studentId: number
}

const RepertoireList = ({ studentId }) => {
  const { repertoire, isLoading, getRepertoire } = useRepertoire()

  const [searchParams, setSearchParams] = useSearchParams()
  const [sorting, setSorting] = useState<TSorting>({
    sort: 'startDate',
    ascending: 'false',
  })
  const [searchInput, setSearchInput] = useState('')
  const { currentStudentId, students } = useStudents()

  const currentStudent = students.find((student) => student.id === studentId)

  useEffect(() => {
    return () => setSearchParams({})
  }, [])

  useEffect(() => {
    getRepertoire(studentId)
  }, [studentId])

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  useEffect(() => {
    const sortBy = searchParams.get('sort')
    const ascending = searchParams.get('asc')

    setSorting({
      sort: sortBy || sorting.sort,
      ascending: ascending || sorting.ascending,
    })
  }, [searchParams])

  const isEditing = searchParams.get('edit') ? true : false

  const filteredRepertoire = repertoire.filter((song) =>
    song.title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
  )

  const sortedFilteredRepertoire = sortRepertoire(
    filteredRepertoire,
    sorting
  ).filter((item) => item.studentId === currentStudent.id)

  return (
    <motion.div
      className="repertoire-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="header">
        <h2 className="heading-2">
          Repetoire {currentStudent.firstName} {currentStudent.lastName}
        </h2>
        <SearchBar
          searchInput={searchInput}
          handlerSearchInput={handleSearchInput}
          disabled={isEditing}
        />
      </div>

      <AddRepertoireItem studentId={studentId} />

      <Table
        columns={
          isEditing ? '1fr repeat(2, 12ch) 9rem' : '1fr repeat(2, 10ch) 4rem'
        }
      >
        <Table.Header>
          <div>
            <span>Song</span>
            <ButtonSort name="title" />
          </div>
          <div>
            <span>Start</span>
            <ButtonSort name="startDate" />
          </div>
          <div>
            <span>Ende</span>
            <ButtonSort name="endDate" />
          </div>
          <div></div>
        </Table.Header>
        {isLoading ? (
          <Loader loading={isLoading} />
        ) : (
          <Menus>
            <Table.Body
              data={sortedFilteredRepertoire}
              emptyMessage="Keine Songs gefunden"
              render={(item) => <RepertoireItem key={item.id} item={item} />}
              className={`${isEditing ? 'scroll-lock' : ''}`}
            />
          </Menus>
        )}
        <Table.Footer>
          {repertoire.length > 0 && (
            <span className="count">Anzahl Songs: {repertoire.length}</span>
          )}
        </Table.Footer>
      </Table>
    </motion.div>
  )
}

export default RepertoireList