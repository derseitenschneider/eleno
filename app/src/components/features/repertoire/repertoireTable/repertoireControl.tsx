import { Button } from '@/components/ui/button'
import SearchBar from '@/components/ui/SearchBar.component'
import type { Lesson, RepertoireItem } from '@/types/types'
import { File, FileDown } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ExportRepertoire from '../ExportRepertoire.component'

type RepertoireControlProps = {
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  isFetching: boolean
}
export default function RepertoireControl({
  globalFilter,
  setGlobalFilter,
  isFetching,
}: RepertoireControlProps) {
  const { studentId } = useParams()
  const queryClient = useQueryClient()
  const repertoireItems = queryClient.getQueryData([
    'repertoire',
    { studentId: Number(studentId) },
  ]) as Array<RepertoireItem>

  const [modalOpen, setModalOpen] = useState<'EXPORT' | undefined>()

  const hasRepertoireItems = repertoireItems?.length > 0

  return (
    <div className='flex items-center gap-4 mb-4'>
      <div className='mr-auto'>
        {hasRepertoireItems && (
          <p className='text-sm'>
            Anzahl Songs: <span>{repertoireItems.length}</span>
          </p>
        )}
      </div>
      <Button
        size='sm'
        variant='outline'
        onClick={() => setModalOpen('EXPORT')}
        disabled={!hasRepertoireItems || isFetching}
      >
        <FileDown className='h-4 w-4 text-primary mr-2' />
        Exportieren
      </Button>
      <SearchBar
        searchInput={globalFilter || ''}
        setSearchInput={(value) => setGlobalFilter(value)}
        disabled={!hasRepertoireItems || isFetching}
      />
      <Dialog
        open={modalOpen === 'EXPORT'}
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
