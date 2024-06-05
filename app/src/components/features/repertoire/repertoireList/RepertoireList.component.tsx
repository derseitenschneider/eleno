import { HiArrowSmLeft } from "react-icons/hi"
import { HiOutlineDocumentArrowDown } from "react-icons/hi2"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import Table from "../../../ui/table/Table.component"

import type { Sorting, Student } from "../../../../types/types"
import sortRepertoire from "../../../../utils/sortRepertoire"
import ButtonSort from "../../../ui/buttonSort/ButtonSort.component"
import SearchBar from "../../../ui/searchBar/SearchBar.component"
import RepertoireItem from "../RepertoireItem.component"

import { useRepertoire } from "../../../../services/context/RepertoireContext"
import { useStudents } from "../../../../services/context/StudentContext"
import Loader from "../../../ui/loader/Loader"
import Menus from "../../../ui/menu/Menus.component"
import Modal from "../../../ui/modal/Modal.component"
import AddRepertoireItem from "../addRepertoireItem/AddRepertoireItem.component"
import ExportRepertoire from "../exportRepertoire/ExportRepertoire.component"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"

function RepertoireList() {
  const { repertoire, isLoading, getRepertoire } = useRepertoire()

  const [searchParams] = useSearchParams()
  const [sorting, setSorting] = useState<Sorting>({
    sort: "startDate",
    ascending: false,
  })
  const [searchInput, setSearchInput] = useState("")
  const queryClient = useQueryClient()
  const students = queryClient.getQueryData(["students"]) as
    | Array<Student>
    | undefined
  const { studentId } = useParams()

  const { activeSortedStudentIds, setCurrentStudentIndex } = useStudents()

  const isActiveStudent = !!activeSortedStudentIds.find(
    (el) => el === Number(studentId),
  )

  const navigate = useNavigate()

  const currentStudent = students?.find(
    (student) => student.id === Number(studentId),
  )

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  // useEffect(() => {
  //   const sortBy = searchParams.get("sort")
  //   const ascending = searchParams.get("asc")
  //
  //   if (!sortBy) {
  //     setSorting({
  //       sort: "startDate",
  //       ascending: null,
  //     })
  //   } else {
  //     setSorting({
  //       sort: sortBy,
  //       ascending,
  //     })
  //   }
  // }, [searchParams])

  const filteredRepertoire = repertoire.filter((song) =>
    song.title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()),
  )

  const sortedFilteredRepertoire = sortRepertoire(
    filteredRepertoire,
    sorting,
  ).filter((item) => item.studentId === Number(studentId))

  const handleNavigate = () => {
    const studentIndex = activeSortedStudentIds.indexOf(Number(studentId))
    setCurrentStudentIndex(studentIndex)
    navigate("/lessons")
  }

  return (
    <motion.div
      className='repertoire-list container'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {isActiveStudent && (
        <button type='button' className='link-back' onClick={handleNavigate}>
          <HiArrowSmLeft />
          <span>Zur Lektion</span>
        </button>
      )}
      <div className='header'>
        <h2 className='heading-2'>
          Repetoire {currentStudent?.firstName} {currentStudent?.lastName}
        </h2>
      </div>

      <AddRepertoireItem studentId={Number(studentId)} />
      {repertoire.length > 0 && (
        <div className='controls'>
          <span className='count'>Anzahl Songs: {repertoire.length}</span>

          <Modal>
            <Modal.Open opens='export'>
              <Button type='button' size='sm'>
                <HiOutlineDocumentArrowDown />
                <span>Exportieren</span>
              </Button>
            </Modal.Open>

            <Modal.Window name='export'>
              <ExportRepertoire repertoire={sortedFilteredRepertoire} />
            </Modal.Window>
          </Modal>
          <SearchBar
            searchInput={searchInput}
            handlerSearchInput={handleSearchInput}
          />
        </div>
      )}
    </motion.div>
  )
}

export default RepertoireList
