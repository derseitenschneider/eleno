import { Button } from "@/components/ui/button"
import SearchBar from "@/components/ui/SearchBar.component"
import type { Lesson } from "@/types/types"
import { File } from "lucide-react"
import type { Table } from "@tanstack/react-table"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQueryClient } from "@tanstack/react-query"
import { useParams, useSearchParams } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ExportLessons from "../ExportLessons.component"

type AllLessonsControlPros = {
  table: Table<Lesson>
  isFetching: boolean
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
}
export default function AllLessonsControl({
  isFetching,
  globalFilter,
  setGlobalFilter,
}: AllLessonsControlPros) {
  const queryClient = useQueryClient()
  const { studentId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalOpen, setModalOpen] = useState<"EXPORT" | undefined>()
  const { years: lessonYears } = queryClient.getQueryData([
    "lesson-years",
    { studentId: Number(studentId) },
  ]) as { studentId: number; years: Array<number> }

  const selectedYear = searchParams.get("year")

  function handleSelect(year: string) {
    setSearchParams({ year })
  }
  return (
    <div className='flex items-center justify-between mb-4'>
      <SearchBar
        searchInput={globalFilter || ""}
        setSearchInput={(value) => setGlobalFilter(value)}
        disabled={isFetching}
      />
      <div className='flex items-center gap-4'>
        <Button
          size='sm'
          variant='outline'
          onClick={() => setModalOpen("EXPORT")}
        >
          <File className='h-4 w-4 text-primary mr-2' />
          Exportieren
        </Button>

        <Select
          disabled={isFetching}
          onValueChange={handleSelect}
          defaultValue={String(selectedYear)}
        >
          <SelectTrigger className='-[180px]'>
            <SelectValue placeholder='Jahr' />
          </SelectTrigger>
          <SelectContent>
            {lessonYears?.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Dialog
        open={modalOpen === "EXPORT"}
        onOpenChange={() => setModalOpen(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
            <ExportLessons studentId={Number(studentId)} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
