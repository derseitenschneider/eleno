import type { TTodoItem } from '@/types/types'

const generateMockTodos = (): TTodoItem[] => {
  const today = new Date()
  const user_id = 'mock-user-123456' // Single user ID for all todos

  return [
    {
      id: 1,
      created_at: new Date(
        today.getTime() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      text: 'Unterrichtsmaterial für Anfänger vorbereiten',
      due: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      completed: false,
      user_id: user_id,
      studentId: undefined,
      groupId: undefined,
    },
    {
      id: 2,
      created_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      text: 'Posaunenkonzert Noten bestellen',
      due: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      completed: true,
      studentId: undefined,
      groupId: undefined,
      user_id: user_id,
    },
    {
      id: 3,
      created_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      studentId: undefined,
      groupId: undefined,
      text: 'Atemübungen für fortgeschrittene Schüler entwickeln',
      due: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      completed: false,
      user_id: user_id,
    },
    {
      id: 4,
      created_at: new Date(
        today.getTime() - 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      text: 'Posaunen für Schulorchester warten',
      due: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      completed: true,
      user_id: user_id,
      studentId: undefined,
      groupId: undefined,
    },
    {
      id: 5,
      created_at: new Date(
        today.getTime() - 1 * 24 * 60 * 60 * 1000,
      ).toISOString(),

      studentId: undefined,
      groupId: undefined,
      text: 'Ensembleprobe vorbereiten',
      due: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
      completed: false,
      user_id: user_id,
    },
    {
      id: 6,
      created_at: new Date(
        today.getTime() - 4 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      studentId: undefined,
      groupId: undefined,
      text: 'Online-Unterrichtsmethoden recherchieren',
      due: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      completed: true,
      user_id: user_id,
    },
    {
      id: 7,
      created_at: today.toISOString(),
      text: 'Präsentation über Posaunengeschichte erstellen',
      due: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      studentId: undefined,
      groupId: undefined,
      completed: false,
      user_id: user_id,
    },
    {
      id: 8,
      created_at: new Date(
        today.getTime() - 6 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      text: 'Fortschrittsberichte für Schüler schreiben',
      due: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
      completed: true,
      studentId: undefined,
      groupId: undefined,
      user_id: user_id,
    },
    {
      id: 9,
      created_at: new Date(
        today.getTime() - 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      text: 'Neue Jazzetüden für Posaune komponieren',
      due: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
      completed: false,
      studentId: undefined,
      groupId: undefined,
      user_id: user_id,
    },
    {
      id: 10,
      created_at: new Date(
        today.getTime() - 1 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      text: 'Posaunenchor-Proben planen',
      completed: true,
      due: undefined,
      studentId: undefined,
      groupId: undefined,
      user_id: user_id,
    },
  ]
}

export const mockTodos = generateMockTodos()
