import type { RepertoireItem } from '@/types/types'

const user_id = 'mock-user-123456' // Single user ID for all todos
const now = new Date()
const mockRepertoire: Array<RepertoireItem> = [
  // Lisa Müller (Gitarre)
  {
    created_at: new Date().toISOString(),
    studentId: 1,
    title: 'Wonderwall',
    id: 1,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 6, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() - 5, 15),
  },
  {
    created_at: new Date().toISOString(),
    studentId: 1,
    title: 'Stairway to Heaven',
    id: 2,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 5, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() - 3, 30),
  },
  {
    created_at: new Date().toISOString(),
    studentId: 1,
    title: 'Hotel California',
    id: 3,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() - 1, 15),
  },
  {
    created_at: new Date().toISOString(),
    studentId: 1,
    title: 'Blackbird',
    id: 4,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    endDate: undefined,
  },

  // Max Schmidt (E-Gitarre)
  {
    created_at: new Date().toISOString(),
    studentId: 2,
    title: 'Smoke on the Water',
    id: 5,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 5, 15),
    endDate: new Date(now.getFullYear(), now.getMonth() - 4, 30),
  },
  {
    created_at: new Date().toISOString(),
    studentId: 2,
    title: "Sweet Child O' Mine",
    id: 6,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 4, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() - 2, 15),
  },
  {
    created_at: new Date().toISOString(),
    studentId: 2,
    title: 'Enter Sandman',
    id: 7,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
    endDate: new Date(now.getFullYear(), now.getMonth(), 15),
  },
  {
    created_at: new Date().toISOString(),
    studentId: 2,
    title: 'Smells Like Teen Spirit',
    id: 8,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: undefined,
  },

  // Emma Weber (Ukulele)
  {
    created_at: new Date().toISOString(),
    studentId: 3,
    title: 'Somewhere Over the Rainbow',
    id: 9,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 4, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() - 3, 15),
  },
  {
    created_at: new Date().toISOString(),
    studentId: 3,
    title: "I'm Yours",
    id: 10,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() - 1, 30),
  },
  {
    created_at: new Date().toISOString(),
    studentId: 3,
    title: 'Count on Me',
    id: 11,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 1, 15),
    endDate: undefined,
  },

  // Felix Bauer (Gitarre)
  {
    created_at: new Date().toISOString(),
    studentId: 4,
    title: 'Classical Gas',
    id: 12,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 5, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() - 3, 30),
  },
  {
    created_at: new Date().toISOString(),
    studentId: 4,
    title: 'Asturias',
    id: 13,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 3, 15),
    endDate: new Date(now.getFullYear(), now.getMonth() - 1, 15),
  },
  {
    created_at: new Date().toISOString(),
    studentId: 4,
    title: 'Recuerdos de la Alhambra',
    id: 14,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    endDate: undefined,
  },

  // Sophie Klein (E-Gitarre)
  {
    created_at: new Date().toISOString(),
    studentId: 5,
    title: 'Seven Nation Army',
    id: 15,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 4, 15),
    endDate: new Date(now.getFullYear(), now.getMonth() - 3, 30),
  },
  {
    created_at: new Date().toISOString(),
    studentId: 5,
    title: 'Back in Black',
    id: 16,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() - 1, 15),
  },
  {
    created_at: new Date().toISOString(),
    studentId: 5,
    title: 'Sultans of Swing',
    id: 17,
    user_id,
    startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
    endDate: undefined,
  },
]

export default mockRepertoire
