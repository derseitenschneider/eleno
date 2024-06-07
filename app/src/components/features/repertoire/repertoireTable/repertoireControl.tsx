import { Button } from "@/components/ui/button"
import SearchBar from "@/components/ui/searchBar/SearchBar.component"
import type { Lesson, RepertoireItem } from "@/types/types"
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

type RepertoireControlProps = {
  table: Table<RepertoireItem>
  isFetching: boolean
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
}
export default function RepertoireControl({
  isFetching,
  globalFilter,
  setGlobalFilter,
}: RepertoireControlProps) {
  const queryClient = useQueryClient()
  const { studentId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalOpen, setModalOpen] = useState<"EXPORT" | undefined>()

  return (
    <div className='flex items-center justify-between mb-4'>
      <SearchBar
        searchInput={globalFilter || ""}
        setSearchInput={(value) => setGlobalFilter(value)}
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
      </div>
      <Dialog
        open={modalOpen === "EXPORT"}
        onOpenChange={() => setModalOpen(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
