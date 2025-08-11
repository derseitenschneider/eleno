import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  createMockGroups,
  createMockLessons,
  createMockNotes,
  createMockStudents,
  createMockTodo,
} from './factories'

// Mock data
const mockStudents = createMockStudents(5)
const mockGroups = createMockGroups(3)
const mockLessons = createMockLessons(10)
const mockNotes = createMockNotes(6)

// API handlers
export const handlers = [
  // Students endpoints
  http.get('/rest/v1/students', () => {
    return HttpResponse.json(mockStudents)
  }),

  http.post('/rest/v1/students', async ({ request }) => {
    const newStudent = (await request.json()) as any
    const createdStudent = {
      id: Date.now(),
      ...newStudent,
      created_at: new Date().toISOString(),
    }
    return HttpResponse.json(createdStudent, { status: 201 })
  }),

  http.patch('/rest/v1/students', async ({ request }) => {
    const updates = (await request.json()) as any
    const updatedStudent = { ...mockStudents[0], ...updates }
    return HttpResponse.json(updatedStudent)
  }),

  http.delete('/rest/v1/students', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Groups endpoints
  http.get('/rest/v1/groups', () => {
    return HttpResponse.json(mockGroups)
  }),

  http.post('/rest/v1/groups', async ({ request }) => {
    const newGroup = (await request.json()) as any
    const createdGroup = {
      id: Date.now(),
      ...newGroup,
      created_at: new Date().toISOString(),
    }
    return HttpResponse.json(createdGroup, { status: 201 })
  }),

  http.patch('/rest/v1/groups', async ({ request }) => {
    const updates = (await request.json()) as any
    const updatedGroup = { ...mockGroups[0], ...updates }
    return HttpResponse.json(updatedGroup)
  }),

  // Lessons endpoints
  http.get('/rest/v1/lessons', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    if (status === 'eq.prepared') {
      return HttpResponse.json(
        mockLessons.filter((l) => l.status === 'prepared'),
      )
    }

    return HttpResponse.json(
      mockLessons.filter((l) => l.status === 'documented'),
    )
  }),

  http.post('/rest/v1/lessons', async ({ request }) => {
    const newLesson = (await request.json()) as any
    const createdLesson = {
      id: Date.now(),
      ...newLesson,
      created_at: new Date().toISOString(),
      expiration_base: '7d',
      homeworkKey: 'test-key',
    }
    return HttpResponse.json(createdLesson, { status: 201 })
  }),

  http.patch('/rest/v1/lessons', async ({ request }) => {
    const updates = (await request.json()) as any
    const updatedLesson = { ...mockLessons[0], ...updates }
    return HttpResponse.json(updatedLesson)
  }),

  http.delete('/rest/v1/lessons', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Notes endpoints
  http.get('/rest/v1/notes', () => {
    return HttpResponse.json(mockNotes)
  }),

  http.post('/rest/v1/notes', async ({ request }) => {
    const newNote = (await request.json()) as any
    const createdNote = {
      id: Date.now(),
      ...newNote,
      created_at: new Date().toISOString(),
    }
    return HttpResponse.json(createdNote, { status: 201 })
  }),

  http.patch('/rest/v1/notes', async ({ request }) => {
    const updates = (await request.json()) as any
    const updatedNote = { ...mockNotes[0], ...updates }
    return HttpResponse.json(updatedNote)
  }),

  // Todos endpoints
  http.get('/rest/v1/todos', () => {
    const mockTodos = [
      createMockTodo(),
      createMockTodo({ id: 2, text: 'Plan next concert', completed: true }),
    ]
    return HttpResponse.json(mockTodos)
  }),

  http.post('/rest/v1/todos', async ({ request }) => {
    const newTodo = (await request.json()) as any
    const createdTodo = {
      id: Date.now(),
      ...newTodo,
      created_at: new Date().toISOString(),
    }
    return HttpResponse.json(createdTodo, { status: 201 })
  }),

  // User profile endpoints
  http.get('/rest/v1/profiles', () => {
    return HttpResponse.json({
      id: 'test-user-id',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    })
  }),

  // Settings endpoints
  http.get('/rest/v1/settings', () => {
    return HttpResponse.json({
      id: 'settings-1',
      user_id: 'test-user-id',
      theme: 'light',
      language: 'en',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    })
  }),

  // Subscription endpoints
  http.get('/rest/v1/subscriptions', () => {
    return HttpResponse.json({
      id: 'subscription-1',
      user_id: 'test-user-id',
      status: 'active',
      plan: 'monthly',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    })
  }),

  // Messages endpoints
  http.get('/rest/v1/messages', () => {
    return HttpResponse.json([])
  }),

  // Feature flags endpoints
  http.get('/rest/v1/feature_flags', () => {
    return HttpResponse.json([])
  }),

  // Error handlers for testing error scenarios
  http.get('/rest/v1/error-test', () => {
    return new HttpResponse('Server Error', { status: 500 })
  }),

  // Auth endpoints
  http.post('/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      },
    })
  }),
]

// Create server instance
export const server = setupServer(...handlers)

// Helper functions for test setup - remove from here since they're in setup.ts
// export function setupMSW() {
//   beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
//   afterEach(() => server.resetHandlers())
//   afterAll(() => server.close())
// }

// Error simulation helpers
export function simulateNetworkError(endpoint: string) {
  server.use(
    http.get(endpoint, () => {
      return HttpResponse.error()
    }),
  )
}

export function simulateServerError(endpoint: string, status = 500) {
  server.use(
    http.get(endpoint, () => {
      return new HttpResponse('Server Error', { status })
    }),
  )
}
