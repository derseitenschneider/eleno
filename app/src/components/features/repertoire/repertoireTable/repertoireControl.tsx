import { Button } from "@/components/ui/button"
import SearchBar from "@/components/ui/SearchBar.component"
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
import ExportRepertoire from "../ExportRepertoire.component"

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
  const { studentId } = useParams()
  const queryClient = useQueryClient()
  const repertoireItems = queryClient.getQueryData([
    "repertoire",
    { studentId: Number(studentId) },
  ]) as Array<RepertoireItem>

  const [modalOpen, setModalOpen] = useState<"EXPORT" | undefined>()

  const hasRepertoireItems = repertoireItems.length > 0

  return (
    <div className='flex items-center gap-4 mb-4'>
      <div className='mr-auto'>
        {hasRepertoireItems && (
          <p>
            Anzahl Songs: <span>{repertoireItems.length}</span>
          </p>
        )}
      </div>
      <Button
        size='sm'
        variant='outline'
        onClick={() => setModalOpen("EXPORT")}
        disabled={!hasRepertoireItems}
      >
        <File className='h-4 w-4 text-primary mr-2' />
        Exportieren
      </Button>
      <SearchBar
        searchInput={globalFilter || ""}
        setSearchInput={(value) => setGlobalFilter(value)}
        disabled={!hasRepertoireItems}
      />
      <Dialog
        open={modalOpen === "EXPORT"}
        onOpenChange={() => setModalOpen(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Repertoire exportieren</DialogTitle>
            <ExportRepertoire studentId={Number(studentId)} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
