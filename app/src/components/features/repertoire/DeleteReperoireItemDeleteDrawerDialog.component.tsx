import parse from 'html-react-parser'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import {
  DrawerOrDialog,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { useQueryClient } from '@tanstack/react-query'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import type { Group, RepertoireItem, Student } from '@/types/types'
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
