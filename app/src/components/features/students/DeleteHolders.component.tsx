import { useQueryClient } from '@tanstack/react-query'
import type { Group, Student } from '@/types/types'
import { Button } from '@/components/ui/button'
import { useDeleteStudents } from './useDeleteStudents'
import { useDeleteGroups } from '../groups/useDeleteGroups'
import fetchErrorToast from '@/hooks/fetchErrorToast'
import { toast } from 'sonner'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface DeleteStudentsProps {
  onSuccess: () => void
  holderIds: string[]
}

function DeleteHolders({ onSuccess, holderIds }: DeleteStudentsProps) {
  const queryClient = useQueryClient()
  const allStudents = queryClient.getQueryData(['students']) as
    | Array<Student>
    | undefined
  const allGroups = queryClient.getQueryData(['groups']) as
    | Array<Group>
    | undefined

  const { deleteStudents } = useDeleteStudents()
  const { deleteGroups } = useDeleteGroups()

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
        <p>
          Möchtest du{' '}
          <span className='font-semibold text-primary'>
            {groupsToDelete[0]?.name}
          </span>{' '}
          und alle zugehörigen Daten löschen?
        </p>
      )}
      {hasOnlyGroups && !isSingularGroup && (
        <p>
          Möchtest du die ausgewählten Gruppen und alle zugehörigen Daten
          löschen?
        </p>
      )}
      {hasOnlyStudents && isSingularStudent && (
        <p>
          Möchtest du{' '}
          <span className='font-semibold text-primary'>
            {studentsToDelete[0]?.firstName} {studentsToDelete[0]?.lastName}
          </span>{' '}
          und alle zugehörigen Daten löschen?
        </p>
      )}
      {hasOnlyStudents && !isSingularStudent && (
        <p>
          Möchtest du die ausgewählten Schüler:innen und alle zugehörigen Daten
          löschen?
        </p>
      )}

      {hasStudentsAndGroups && (
        <p>
          Möchtest du die ausgewählten Schüler:innen und Gruppen und alle
          zugehörigen Daten löschen?
        </p>
      )}
      <div className='flex justify-end gap-4 mt-4'>
        <Button size='sm' variant='outline' onClick={onSuccess}>
          Abbrechen
        </Button>
        <Button size='sm' variant='destructive' onClick={handleDeleteHolders}>
          Löschen
        </Button>
      </div>
    </div>
  )
}

export default DeleteHolders
