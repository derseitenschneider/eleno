import { Button } from '@/components/ui/button'
import SearchBar from '@/components/ui/SearchBar.component'
import type { RepertoireItem } from '@/types/types'
import { FileDown } from 'lucide-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ExportRepertoire from '../ExportRepertoire.component'
import useCurrentHolder from '../../lessons/useCurrentHolder'

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
  const { currentLessonHolder } = useCurrentHolder()
  const queryClient = useQueryClient()
  const repertoireItems = queryClient.getQueryData([
    'repertoire',
    {
      holder: `${currentLessonHolder?.type}-${currentLessonHolder?.holder.id}`,
    },
  ]) as Array<RepertoireItem>

  const [modalOpen, setModalOpen] = useState<'EXPORT' | undefined>()

  const hasRepertoireItems = repertoireItems?.length > 0

  if (!currentLessonHolder) return null

  return (
    <div className='sm:flex hidden items-center gap-4 mb-4'>
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
            <ExportRepertoire lessonHolder={currentLessonHolder} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
