import { useQueryClient } from '@tanstack/react-query'
import useFetchErrorToast from './fetchErrorToast'
import type { Group, Student } from '@/types/types'
import { useDeleteStudents } from '@/components/features/students/useDeleteStudents'
import { useDeleteGroups } from '@/components/features/groups/useDeleteGroups'
import { toast } from 'sonner'

export function useDeleteHolders(
  holderIds: Array<string>,
  onSuccess?: () => void,
) {
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
    dialogBody =
      'Möchtest du die ausgewählten Schüler:innen und Gruppen und alle zugehörigen Daten löschen?'
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
      onSuccess?.()
    }
  }

  return {
    handleDeleteHolders,
    dialogTitle,
    dialogBody,
    isDeletingGroups,
    isDeletingStudents,
  }
}
