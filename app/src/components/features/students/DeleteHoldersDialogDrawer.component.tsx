import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import DeleteHolders from './DeleteHolders.component'
import { useQueryClient } from '@tanstack/react-query'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import type { Group, Student } from '@/types/types'
import { X } from 'lucide-react'

export type DeleteHoldersDialogDrawerProps = {
  open: boolean
  holderIds: string[]
  onOpenChange: () => void
  onSuccess?: () => void
}

export function DeleteHoldersDialogDrawer({
  open,
  onOpenChange,
  holderIds,
  onSuccess,
}: DeleteHoldersDialogDrawerProps) {
  const queryClient = useQueryClient()

  const allStudents = queryClient.getQueryData(['students']) as
    | Array<Student>
    | undefined
  const allGroups = queryClient.getQueryData(['groups']) as
    | Array<Group>
    | undefined
  const studentIds = holderIds
    .filter((holderId) => holderId.includes('s'))
    .map((holderId) => Number.parseInt(holderId.split('-').at(1) || ''))

  const groupIds = holderIds
    .filter((holderId) => holderId.includes('g'))
    .map((holderId) => Number.parseInt(holderId.split('-').at(1) || ''))

  const studentsToDelete = studentIds.map((studentId) =>
    allStudents?.find((student) => student.id === studentId),
  )

  const groupsToDelete = groupIds.map((groupId) =>
    allGroups?.find((group) => group.id === groupId),
  )

  const hasOnlyGroups = studentIds.length === 0
  const hasOnlyStudents = groupIds.length === 0
  const hasStudentsAndGroups = studentIds.length > 0 && groupIds.length > 0
  const isSingularStudent = studentIds.length === 1
  const isSingularGroup = groupIds.length === 1

  let dialogTitle = 'Löschen'
  let dialogBody = ''

  if (hasOnlyGroups) {
    dialogTitle = isSingularGroup ? 'Gruppe löschen' : 'Gruppen löschen'
    dialogBody = isSingularGroup
      ? `Möchtest du <b>${groupsToDelete[0]?.name}</b> und alle zugehörigen Daten löschen?`
      : 'Möchtest du die ausgewählten Gruppen und alle zugehörigen Daten löschen?'
  }
  if (hasOnlyStudents) {
    dialogTitle = isSingularStudent
      ? 'Schüler:in löschen'
      : 'Schüler:innen löschen'
    dialogBody = isSingularStudent
      ? `Möchtest du ${studentsToDelete[0]?.firstName}  und alle zugehörigen Daten löschen?`
      : 'Möchtest du die ausgewählten Gruppen und alle zugehörigen Daten löschen?'
  }

  if (hasStudentsAndGroups) {
    dialogTitle = 'Schüler:innen und Gruppen löschen'
  }
  return (
    <DrawerOrDialog open={open} onOpenChange={onOpenChange}>
      <DrawerOrDialogContent>
        <DrawerOrDialogClose className='absolute right-4 top-4 text-foreground/70'>
          <X className='size-5' />
        </DrawerOrDialogClose>
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>{dialogTitle}</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>

        {hasOnlyGroups && isSingularGroup && (
          <DrawerOrDialogDescription>
            Möchtest du{' '}
            <span className='font-medium text-primary'>
              {groupsToDelete[0]?.name}
            </span>{' '}
            und alle zugehörigen Daten löschen?
          </DrawerOrDialogDescription>
        )}
        {hasOnlyGroups && !isSingularGroup && (
          <DrawerOrDialogDescription>
            Möchtest du die ausgewählten Gruppen und alle zugehörigen Daten
            löschen?
          </DrawerOrDialogDescription>
        )}
        {hasOnlyStudents && isSingularStudent && (
          <DrawerOrDialogDescription>
            Möchtest du{' '}
            <span className='font-medium text-primary'>
              {studentsToDelete[0]?.firstName} {studentsToDelete[0]?.lastName}
            </span>{' '}
            und alle zugehörigen Daten löschen?
          </DrawerOrDialogDescription>
        )}
        {hasOnlyStudents && !isSingularStudent && (
          <DrawerOrDialogDescription>
            Möchtest du die ausgewählten Schüler:innen und alle zugehörigen
            Daten löschen?
          </DrawerOrDialogDescription>
        )}

        {hasStudentsAndGroups && (
          <DrawerOrDialogDescription>
            Möchtest du die ausgewählten Schüler:innen und Gruppen und alle
            zugehörigen Daten löschen?
          </DrawerOrDialogDescription>
        )}
        <DeleteHolders onSuccess={() => onSuccess?.()} holderIds={holderIds} />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
