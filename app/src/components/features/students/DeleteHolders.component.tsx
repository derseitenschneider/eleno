import { useQueryClient } from '@tanstack/react-query'
import type { Group, Student } from '@/types/types'
import { Button } from '@/components/ui/button'
import { useDeleteStudents } from './useDeleteStudents'
import { useDeleteGroups } from '../groups/useDeleteGroups'
import { toast } from 'sonner'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import MiniLoader from '@/components/ui/MiniLoader.component'
import useFetchErrorToast from '@/hooks/fetchErrorToast'

interface DeleteStudentsProps {
  onSuccess: () => void
  holderIds: string[]
}

function DeleteHolders({ onSuccess, holderIds }: DeleteStudentsProps) {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const allStudents = queryClient.getQueryData(['students']) as
    | Array<Student>
    | undefined
  const allGroups = queryClient.getQueryData(['groups']) as
    | Array<Group>
    | undefined

  const { deleteStudents, isDeleting: isDeletingStudents } = useDeleteStudents()
  const { deleteGroups, isDeleting: isDeletingGroups } = useDeleteGroups()

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

  async function handleDeleteHolders() {
    try {
      if (studentIds.length) await deleteStudents(studentIds)
      if (groupIds.length) await deleteGroups(groupIds)
      if (hasOnlyGroups)
        return toast.success(`Gruppe${!isSingularGroup ? 'n' : ''} gelöscht.`)
      if (hasOnlyStudents)
        return toast.success(
          `Schüler:in${!isSingularStudent ? 'nen' : ''} gelöscht.`,
        )
      toast.success('Schüler:innen und Gruppen gelöscht.')
    } catch {
      fetchErrorToast()
    } finally {
      onSuccess()
    }
  }
  return (
    <div>
      <DialogHeader>
        <DialogTitle>{dialogTitle}</DialogTitle>
      </DialogHeader>

      {hasOnlyGroups && isSingularGroup && (
        <DialogDescription>
          Möchtest du{' '}
          <span className='font-medium text-primary'>
            {groupsToDelete[0]?.name}
          </span>{' '}
          und alle zugehörigen Daten löschen?
        </DialogDescription>
      )}
      {hasOnlyGroups && !isSingularGroup && (
        <DialogDescription>
          Möchtest du die ausgewählten Gruppen und alle zugehörigen Daten
          löschen?
        </DialogDescription>
      )}
      {hasOnlyStudents && isSingularStudent && (
        <DialogDescription>
          Möchtest du{' '}
          <span className='font-medium text-primary'>
            {studentsToDelete[0]?.firstName} {studentsToDelete[0]?.lastName}
          </span>{' '}
          und alle zugehörigen Daten löschen?
        </DialogDescription>
      )}
      {hasOnlyStudents && !isSingularStudent && (
        <DialogDescription>
          Möchtest du die ausgewählten Schüler:innen und alle zugehörigen Daten
          löschen?
        </DialogDescription>
      )}

      {hasStudentsAndGroups && (
        <DialogDescription>
          Möchtest du die ausgewählten Schüler:innen und Gruppen und alle
          zugehörigen Daten löschen?
        </DialogDescription>
      )}
      <div className='mt-4 flex justify-end gap-4'>
        <Button size='sm' variant='outline' onClick={onSuccess}>
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
          <Button size='sm' variant='destructive' onClick={handleDeleteHolders}>
            Löschen
          </Button>
          {(isDeletingStudents || isDeletingGroups) && <MiniLoader />}
        </div>
      </div>
    </div>
  )
}

export default DeleteHolders
