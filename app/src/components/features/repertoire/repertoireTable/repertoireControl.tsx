import { useQueryClient } from '@tanstack/react-query'
import { FileDown } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SearchBar from '@/components/ui/SearchBar.component'
import type { RepertoireItem } from '@/types/types'
import useCurrentHolder from '../../lessons/useCurrentHolder'
import ExportRepertoireSkeleton from '../ExportRepertoireSkeleton.component'

const ExportRepertoire = lazy(() => import('../ExportRepertoire.component'))

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
    <div className='mb-4 hidden items-center gap-4 sm:flex'>
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
        <FileDown className='mr-1 h-4 w-4 text-primary' />
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
          </DialogHeader>
          <DialogDescription className='hidden'>
            Exportiere die Repertoireliste.
          </DialogDescription>
          <Suspense fallback={<ExportRepertoireSkeleton />}>
            <ExportRepertoire lessonHolder={currentLessonHolder} />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  )
}
