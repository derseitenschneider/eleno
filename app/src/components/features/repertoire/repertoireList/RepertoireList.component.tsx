import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Table from '../../../common/table/Table.component'
import './repertoireList.style.scss'

import { TSorting } from '../../../../types/types'
import sortRepertoire from '../../../../utils/sortRepertoire'
import ButtonSort from '../../../common/buttonSort/ButtonSort.component'
import SearchBar from '../../../common/searchBar/SearchBar.component'
import RepertoireItem from '../RepertoireItem.component'

import { useRepertoire } from '../../../../contexts/RepertoireContext'
import { useStudents } from '../../../../contexts/StudentContext'
import Loader from '../../../common/loader/Loader'
import Menus from '../../../common/menu/Menus.component'
import AddRepertoireItem from '../addRepertoireItem/AddRepertoireItem.component'

type TRepertoireProps = {
  studentId: number
}

function RepertoireList({ studentId }: TRepertoireProps) {
  const { repertoire, isLoading, getRepertoire } = useRepertoire()

  const [searchParams, setSearchParams] = useSearchParams()
  const [sorting, setSorting] = useState<TSorting>({
    sort: 'startDate',
    ascending: null,
  })
  const [searchInput, setSearchInput] = useState('')
  const { students } = useStudents()

  const currentStudent = students.find((student) => student.id === studentId)

  useEffect(() => {
    return () => setSearchParams({})
  }, [])

  useEffect(() => {
    getRepertoire(studentId)
  }, [getRepertoire, studentId])

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }
  // const sortBy = searchParams.get('sort')
  // const ascending = searchParams.get('asc')
  // const sorting: TSorting = {
  //   sort: sortBy || 'startDate',
  //   ascending: ascending,
  // }
  // console.log(sortBy)

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
  console.log(sorting)

  const isEditing = !!searchParams.get('edit')
  const filteredRepertoire = repertoire.filter((song) =>
    song.title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()),
  )

  const sortedFilteredRepertoire = sortRepertoire(
    filteredRepertoire,
    sorting,
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
