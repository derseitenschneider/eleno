import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { Button } from '@/components/ui/button'
import type { RepertoireItem } from '@/types/types'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import parse from 'html-react-parser'
import { X } from 'lucide-react'
import DeleteRepertoireItem from './DeleteRepertoireItem.component'

export type DeleteRepertoireItemDrawerDialogProps = {
  open: boolean
  item: RepertoireItem
  onOpenChange: () => void
  dialogTitle?: string
}

export function DeleteRepertoireItemDrawerDialog({
  open,
  onOpenChange,
  item,
  dialogTitle = 'Song löschen',
}: DeleteRepertoireItemDrawerDialogProps) {
  return (
    <DrawerOrDialog open={open} onOpenChange={onOpenChange}>
      <DrawerOrDialogContent>
        <DrawerOrDialogClose asChild>
          <Button
            variant='ghost'
            className='absolute right-4 top-4 text-foreground/70'
          >
            <X className='size-5' />
          </Button>
        </DrawerOrDialogClose>
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>{dialogTitle}</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>

        <DrawerOrDialogDescription>
          Möchtest du den Song{' '}
          <b>«{parse(removeHTMLAttributes(item.title))}»</b> wirklich aus dem
          Repertoire entfernen?
        </DrawerOrDialogDescription>
        <DeleteRepertoireItem onCloseModal={onOpenChange} item={item} />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
