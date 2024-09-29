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
      text: 'Einspielübungen vorbereiten',
      due: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      completed: false,
      user_id: user_id,
      studentId: 3,
      groupId: null,
    },
    {
      id: 2,
      created_at: new Date(
        today.getTime() - 5 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      text: 'Sultans of Swing transkribieren',
      due: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      completed: true,
      studentId: 5,
      groupId: null,
      user_id: user_id,
    },
    {
      id: 3,
      created_at: new Date(
        today.getTime() - 3 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      studentId: undefined,
      groupId: undefined,
      text: 'Fingerübungen Sweep-Technik zusammenstellen',
      due: undefined,
      completed: false,
      user_id: user_id,
    },
    {
      id: 4,
      created_at: new Date(
        today.getTime() - 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      text: 'Abklärung Mietinstrumente für Probeabos',
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
      groupId: 1,
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
      due: undefined,
      completed: true,
      user_id: user_id,
    },
    {
      id: 7,
      created_at: today.toISOString(),
      text: 'Schülerkonzert vorbereiten',
      due: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
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
      text: 'Neue Jazzetüden komponieren',
      due: undefined,
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
      text: 'Schulleitung über Pensum informieren',
      completed: true,
      due: undefined,
      studentId: undefined,
      groupId: undefined,
      user_id: user_id,
    },
  ]
}

export const mockTodos = generateMockTodos()
