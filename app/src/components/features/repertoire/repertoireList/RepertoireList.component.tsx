import { HiArrowSmLeft } from "react-icons/hi"
import { HiOutlineDocumentArrowDown } from "react-icons/hi2"

import { useState } from "react"
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"

import type { Sorting, Student } from "../../../../types/types"
import sortRepertoire from "../../../../utils/sortRepertoire"
import SearchBar from "../../../ui/searchBar/SearchBar.component"

import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { useRepertoire } from "../../../../services/context/RepertoireContext"
import { useStudents } from "../../../../services/context/StudentContext"
import Modal from "../../../ui/modal/Modal.component"
import AddRepertoireItem from "../addRepertoireItem/AddRepertoireItem.component"
import ExportRepertoire from "../exportRepertoire/ExportRepertoire.component"
import { ChevronLeft } from "lucide-react"
import { useRepertoireQuery } from "../repertoireQueries"

function RepertoireList() {
  const { studentId } = useParams()
  const [searchParams] = useSearchParams()
  const {
    data: repertoire,
    isPending,
    error,
  } = useRepertoireQuery(Number(studentId))

  // const [sorting, setSorting] = useState<Sorting>({
  //   sort: "startDate",
  //   ascending: false,
  // })
  // const [searchInput, setSearchInput] = useState("")
  // const queryClient = useQueryClient()
  // const students = queryClient.getQueryData(["students"]) as
  //   | Array<Student>
  //   | undefined
  //
  // const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchInput(e.target.value)
  // }

  // const filteredRepertoire = repertoire?.filter((song) =>
  //   song.title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()),
  // )
  //
  // const sortedFilteredRepertoire = sortRepertoire(
  //   filteredRepertoire,
  //   sorting,
  // ).filter((item) => item.studentId === Number(studentId))

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <NavLink
          to={`/lessons/${studentId}`}
          className='flex items-center gap-2'
        >
          <ChevronLeft className='h-4 w-4 text-primary' />
          <span>Zur Lektion</span>
        </NavLink>
      </div>

      {/* <AddRepertoireItem studentId={Number(studentId)} /> */}
      {/* {repertoire?.length > 0 && ( */}
      {/*   <div className='controls'> */}
      {/*     <span className='count'>Anzahl Songs: {repertoire.length}</span> */}
      {/**/}
      {/*     <Modal> */}
      {/*       <Modal.Open opens='export'> */}
      {/*         <Button type='button' size='sm'> */}
      {/*           <HiOutlineDocumentArrowDown /> */}
      {/*           <span>Exportieren</span> */}
      {/*         </Button> */}
      {/*       </Modal.Open> */}
      {/**/}
      {/*       <Modal.Window name='export'> */}
      {/*         <ExportRepertoire repertoire={sortedFilteredRepertoire} /> */}
      {/*       </Modal.Window> */}
      {/*     </Modal> */}
      {/*     <SearchBar */}
      {/*       searchInput={searchInput} */}
      {/*       handlerSearchInput={handleSearchInput} */}
      {/*     /> */}
      {/*   </div> */}
      {/* )} */}
    </div>
  )
}

export default RepertoireList
