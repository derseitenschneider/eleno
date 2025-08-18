/**
 * Optimized MSW Handlers with Performance Enhancements
 * 
 * This module provides high-performance MSW handlers that:
 * - Pre-compute and cache response data
 * - Use intelligent response generation strategies
 * - Minimize handler processing time
 * - Provide conditional response caching
 * - Support lazy loading of expensive mock data
 */

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { mockCache, studentCache, lessonCache, createCachedFactory } from './mockCache'
import { 
  createBulkStudents, 
  createBulkGroups, 
  createBulkLessons, 
  createBulkNotes,
  createMockTodo,
  getFactoryStats
} from './factories.optimized'

// Pre-computed mock data with lazy initialization
let _preComputedData: {
  students?: any[]
  groups?: any[]
  lessons?: any[]
  notes?: any[]
  profile?: any
  settings?: any
  subscription?: any
} = {}

// Pre-computation flags to avoid duplicate work
let _isPreComputing = false
let _isPreComputed = false

/**
 * Pre-compute all mock data asynchronously
 */
async function preComputeMockData() {
  if (_isPreComputed || _isPreComputing) return
  
  _isPreComputing = true
  
  try {
    // Use optimized bulk creation methods
    const [students, groups, lessons, notes] = await Promise.all([
      createBulkStudents(5),
      createBulkGroups(3), 
      createBulkLessons(10),
      createBulkNotes(6)
    ])

    _preComputedData = {
      students,
      groups,
      lessons,
      notes,
      profile: {
        id: 'test-user-id',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      settings: {
        id: 'settings-1',
        user_id: 'test-user-id',
        theme: 'light',
        language: 'en',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      subscription: {
        id: 'subscription-1',
        user_id: 'test-user-id',
        status: 'active',
        plan: 'monthly',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      }
    }

    _isPreComputed = true
  } finally {
    _isPreComputing = false
  }
}

/**
 * Get or compute mock data on demand
 */
async function getMockData<K extends keyof typeof _preComputedData>(
  key: K
): Promise<typeof _preComputedData[K]> {
  if (!_isPreComputed) {
    await preComputeMockData()
  }
  return _preComputedData[key]
}

/**
 * Fast response generator that uses cached data
 */
function createFastResponse<T>(data: T, status = 200) {
  return HttpResponse.json(data, { status })
}

/**
 * Cached response handlers with intelligent caching strategies
 */
const cachedHandlers = {
  // Students with intelligent caching
  getStudents: createCachedFactory(
    studentCache,
    'students-list',
    async () => getMockData('students')
  ),

  // Groups with caching
  getGroups: createCachedFactory(
    studentCache,
    'groups-list', 
    async () => getMockData('groups')
  ),

  // Lessons with query parameter handling
  getLessons: createCachedFactory(
    lessonCache,
    'lessons-list',
    async (params?: { status?: string }) => {
      const lessons = await getMockData('lessons')
      if (!lessons) return []
      
      if (params?.status === 'eq.prepared') {
        return lessons.filter((l) => l.status === 'prepared')
      }
      return lessons.filter((l) => l.status === 'documented')
    }
  ),

  // Notes with caching
  getNotes: createCachedFactory(
    lessonCache,
    'notes-list',
    async () => getMockData('notes')
  ),

  // Static data with long-term caching
  getProfile: createCachedFactory(
    mockCache,
    'user-profile',
    async () => getMockData('profile')
  ),

  getSettings: createCachedFactory(
    mockCache,
    'user-settings', 
    async () => getMockData('settings')
  ),

  getSubscription: createCachedFactory(
    mockCache,
    'user-subscription',
    async () => getMockData('subscription')
  ),
}

// Optimized API handlers with minimal processing overhead
export const optimizedHandlers = [
  // Students endpoints - cached responses
  http.get('/rest/v1/students', async () => {
    const students = await cachedHandlers.getStudents()
    return createFastResponse(students)
  }),

  http.post('/rest/v1/students', async ({ request }) => {
    const newStudent = await request.json() as any
    const createdStudent = {
      id: Date.now(),
      ...newStudent,
      created_at: new Date().toISOString(),
    }
    
    // Invalidate students cache
    studentCache.invalidate(['students-list'])
    
    return createFastResponse(createdStudent, 201)
  }),

  http.patch('/rest/v1/students', async ({ request }) => {
    const updates = await request.json() as any
    const students = await getMockData('students')
    const updatedStudent = { ...students?.[0], ...updates }
    
    // Invalidate students cache
    studentCache.invalidate(['students-list'])
    
    return createFastResponse(updatedStudent)
  }),

  http.delete('/rest/v1/students', () => {
    // Invalidate students cache
    studentCache.invalidate(['students-list'])
    return new HttpResponse(null, { status: 204 })
  }),

  // Groups endpoints - cached responses
  http.get('/rest/v1/groups', async () => {
    const groups = await cachedHandlers.getGroups()
    return createFastResponse(groups)
  }),

  http.post('/rest/v1/groups', async ({ request }) => {
    const newGroup = await request.json() as any
    const createdGroup = {
      id: Date.now(),
      ...newGroup,
      created_at: new Date().toISOString(),
    }
    
    // Invalidate groups cache
    studentCache.invalidate(['groups-list'])
    
    return createFastResponse(createdGroup, 201)
  }),

  http.patch('/rest/v1/groups', async ({ request }) => {
    const updates = await request.json() as any
    const groups = await getMockData('groups')
    const updatedGroup = { ...groups?.[0], ...updates }
    
    // Invalidate groups cache
    studentCache.invalidate(['groups-list'])
    
    return createFastResponse(updatedGroup)
  }),

  // Lessons endpoints - parameterized caching
  http.get('/rest/v1/lessons', async ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    
    const lessons = await cachedHandlers.getLessons({ 
      status: status || undefined 
    })
    
    return createFastResponse(lessons)
  }),

  http.post('/rest/v1/lessons', async ({ request }) => {
    const newLesson = await request.json() as any
    const createdLesson = {
      id: Date.now(),
      ...newLesson,
      created_at: new Date().toISOString(),
      expiration_base: '7d',
      homeworkKey: 'test-key',
    }
    
    // Invalidate lessons cache
    lessonCache.invalidate(['lessons-list'])
    
    return createFastResponse(createdLesson, 201)
  }),

  http.patch('/rest/v1/lessons', async ({ request }) => {
    const updates = await request.json() as any
    const lessons = await getMockData('lessons')
    const updatedLesson = { ...lessons?.[0], ...updates }
    
    // Invalidate lessons cache
    lessonCache.invalidate(['lessons-list'])
    
    return createFastResponse(updatedLesson)
  }),

  http.delete('/rest/v1/lessons', () => {
    // Invalidate lessons cache
    lessonCache.invalidate(['lessons-list'])
    return new HttpResponse(null, { status: 204 })
  }),

  // Notes endpoints - cached responses
  http.get('/rest/v1/notes', async () => {
    const notes = await cachedHandlers.getNotes()
    return createFastResponse(notes)
  }),

  http.post('/rest/v1/notes', async ({ request }) => {
    const newNote = await request.json() as any
    const createdNote = {
      id: Date.now(),
      ...newNote,
      created_at: new Date().toISOString(),
    }
    
    // Invalidate notes cache
    lessonCache.invalidate(['notes-list'])
    
    return createFastResponse(createdNote, 201)
  }),

  http.patch('/rest/v1/notes', async ({ request }) => {
    const updates = await request.json() as any
    const notes = await getMockData('notes')
    const updatedNote = { ...notes?.[0], ...updates }
    
    // Invalidate notes cache
    lessonCache.invalidate(['notes-list'])
    
    return createFastResponse(updatedNote)
  }),

  // Todos endpoints - lightweight responses
  http.get('/rest/v1/todos', () => {
    // Use quick, non-cached response for simple data
    const mockTodos = [
      createMockTodo(),
      createMockTodo({ id: 2, text: 'Plan next concert', completed: true }),
    ]
    return createFastResponse(mockTodos)
  }),

  http.post('/rest/v1/todos', async ({ request }) => {
    const newTodo = await request.json() as any
    const createdTodo = {
      id: Date.now(),
      ...newTodo,
      created_at: new Date().toISOString(),
    }
    return createFastResponse(createdTodo, 201)
  }),

  // Static endpoints with long-term caching
  http.get('/rest/v1/profiles', async () => {
    const profile = await cachedHandlers.getProfile()
    return createFastResponse(profile)
  }),

  http.get('/rest/v1/settings', async () => {
    const settings = await cachedHandlers.getSettings()
    return createFastResponse(settings)
  }),

  http.get('/rest/v1/subscriptions', async () => {
    const subscription = await cachedHandlers.getSubscription()
    return createFastResponse(subscription)
  }),

  // Lightweight static responses
  http.get('/rest/v1/messages', () => createFastResponse([])),
  http.get('/rest/v1/feature_flags', () => createFastResponse([])),

  // Error simulation handlers (no caching)
  http.get('/rest/v1/error-test', () => {
    return new HttpResponse('Server Error', { status: 500 })
  }),

  // Auth endpoints
  http.post('/auth/v1/token', () => {
    return createFastResponse({
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

// Create optimized server instance
export const optimizedServer = setupServer(...optimizedHandlers)

/**
 * Pre-warm the mock data cache
 */
export async function preWarmMockCache() {
  console.log('🔥 Pre-warming mock cache...')
  const start = performance.now()
  
  await preComputeMockData()
  
  // Pre-warm specific caches
  await Promise.all([
    cachedHandlers.getStudents(),
    cachedHandlers.getGroups(), 
    cachedHandlers.getLessons(),
    cachedHandlers.getNotes(),
    cachedHandlers.getProfile(),
    cachedHandlers.getSettings(),
    cachedHandlers.getSubscription(),
  ])
  
  const end = performance.now()
  console.log(`✅ Mock cache pre-warmed in ${(end - start).toFixed(2)}ms`)
}

/**
 * Reset optimized server state
 */
export function resetOptimizedServer() {
  _preComputedData = {}
  _isPreComputed = false
  _isPreComputing = false
  
  // Clear all caches
  mockCache.clear()
  studentCache.clear()
  lessonCache.clear()
}

/**
 * Get performance metrics from optimized handlers
 */
export function getOptimizedServerMetrics() {
  return {
    factoryStats: getFactoryStats(),
    cacheMetrics: {
      mockCache: mockCache.getMetrics(),
      studentCache: studentCache.getMetrics(),
      lessonCache: lessonCache.getMetrics(),
    },
    cacheInfo: {
      mockCache: mockCache.getCacheInfo(),
      studentCache: studentCache.getCacheInfo(), 
      lessonCache: lessonCache.getCacheInfo(),
    },
    preComputedData: {
      isPreComputed: _isPreComputed,
      isPreComputing: _isPreComputing,
      dataKeys: Object.keys(_preComputedData),
    }
  }
}

// Error simulation helpers for optimized server
export function simulateOptimizedNetworkError(endpoint: string) {
  optimizedServer.use(
    http.get(endpoint, () => HttpResponse.error())
  )
}

export function simulateOptimizedServerError(endpoint: string, status = 500) {
  optimizedServer.use(
    http.get(endpoint, () => new HttpResponse('Server Error', { status }))
  )
}

// Cleanup function for test teardown
export function cleanupOptimizedServer() {
  resetOptimizedServer()
  mockCache.destroy()
  studentCache.destroy()
  lessonCache.destroy()
}