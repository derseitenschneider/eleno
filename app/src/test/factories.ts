/**
 * Optimized Factory Functions with Object Pooling and Performance Tracking
 *
 * This module provides high-performance factory functions that:
 * - Use object pooling to reduce memory allocation
 * - Cache frequently used objects with override support
 * - Track performance metrics and reuse statistics
 * - Provide bulk creation methods for efficiency
 * - Support minimal object variants for simple tests
 */

import { performance } from 'node:perf_hooks'
import type { Database } from '@/types/supabase'

// Database table types
type DbStudent = Database['public']['Tables']['students']['Row']
type DbGroup = Database['public']['Tables']['groups']['Row']
type DbLesson = Database['public']['Tables']['lessons']['Row']
type DbNote = Database['public']['Tables']['notes']['Row']
type DbTodo = Database['public']['Tables']['todos']['Row']
type DbSettings = Database['public']['Tables']['settings']['Row']

// Performance tracking
interface FactoryStats {
  totalCalls: number
  poolHits: number
  poolMisses: number
  hitRate: number
  averageCreationTime: number
  totalCreationTime: number
  memoryReused: number
}

// Object pool configuration
interface PoolConfig {
  maxSize: number
  warmupSize: number
  enableMetrics: boolean
}

// Global factory statistics
let factoryStats: FactoryStats = {
  totalCalls: 0,
  poolHits: 0,
  poolMisses: 0,
  hitRate: 0,
  averageCreationTime: 0,
  totalCreationTime: 0,
  memoryReused: 0,
}

// Object pools for different entity types
const objectPools = {
  students: new Map<string, DbStudent[]>(),
  groups: new Map<string, DbGroup[]>(),
  lessons: new Map<string, any[]>(),
  notes: new Map<string, DbNote[]>(),
  todos: new Map<string, DbTodo[]>(),
  settings: new Map<string, DbSettings[]>(),
}

// Pool configurations
const poolConfigs: Record<keyof typeof objectPools, PoolConfig> = {
  students: { maxSize: 50, warmupSize: 10, enableMetrics: true },
  groups: { maxSize: 30, warmupSize: 5, enableMetrics: true },
  lessons: { maxSize: 100, warmupSize: 20, enableMetrics: true },
  notes: { maxSize: 80, warmupSize: 15, enableMetrics: true },
  todos: { maxSize: 40, warmupSize: 8, enableMetrics: true },
  settings: { maxSize: 20, warmupSize: 3, enableMetrics: true },
}

/**
 * Generate a cache key for object pooling
 */
function generatePoolKey(type: string, overrides?: any): string {
  if (!overrides || Object.keys(overrides).length === 0) {
    return `${type}:default`
  }

  // Create stable key from sorted overrides
  const sortedKeys = Object.keys(overrides).sort()
  const keyParts = sortedKeys.map(
    (key) => `${key}=${JSON.stringify(overrides[key])}`,
  )
  return `${type}:${keyParts.join('&')}`
}

/**
 * Get object from pool or create new one
 */
function getFromPool<T>(
  type: keyof typeof objectPools,
  factory: () => T,
  overrides?: any,
): T {
  const startTime = performance.now()
  factoryStats.totalCalls++

  const poolKey = generatePoolKey(type, overrides)
  const pool = objectPools[type] as Map<string, T[]>

  // Try to get from pool
  const objects = pool.get(poolKey)
  if (objects && objects.length > 0) {
    const obj = objects.pop()!
    factoryStats.poolHits++
    factoryStats.memoryReused += estimateObjectSize(obj)
    return obj
  }

  // Pool miss - create new object
  factoryStats.poolMisses++
  const obj = factory()

  const creationTime = performance.now() - startTime
  factoryStats.totalCreationTime += creationTime
  factoryStats.averageCreationTime =
    factoryStats.totalCreationTime / factoryStats.poolMisses
  factoryStats.hitRate = (factoryStats.poolHits / factoryStats.totalCalls) * 100

  return obj
}

/**
 * Return object to pool for reuse
 */
function returnToPool<T>(
  type: keyof typeof objectPools,
  obj: T,
  overrides?: any,
) {
  const poolKey = generatePoolKey(type, overrides)
  const pool = objectPools[type] as Map<string, T[]>
  const config = poolConfigs[type]
  if (!config) {
    console.warn(`No pool config found for type: ${String(type)}`)
    return
  }

  let objects = pool.get(poolKey)
  if (!objects) {
    objects = []
    pool.set(poolKey, objects)
  }

  if (objects.length < config.maxSize) {
    objects.push(obj)
  }
}

/**
 * Pre-warm object pools with commonly used objects
 */
function warmupPool<T>(
  type: keyof typeof objectPools,
  factory: () => T,
  variants: any[] = [{}],
) {
  const config = poolConfigs[type]
  if (!config) {
    console.warn(`No pool config found for type: ${String(type)}`)
    return
  }

  for (const overrides of variants) {
    const poolKey = generatePoolKey(type, overrides)
    const pool = objectPools[type] as Map<string, T[]>

    if (!pool.has(poolKey)) {
      const objects: T[] = []
      for (let i = 0; i < config.warmupSize; i++) {
        objects.push(factory())
      }
      pool.set(poolKey, objects)
    }
  }
}

/**
 * Base factory templates (frozen for performance)
 */
const baseTemplates = Object.freeze({
  student: Object.freeze({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    instrument: 'Piano',
    archive: false,
    dayOfLesson: 'Montag',
    startOfLesson: '14:00',
    durationMinutes: 60,
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    location: 'Studio A',
    endOfLesson: '15:00',
    homework_sharing_authorized: false,
  }),

  group: Object.freeze({
    id: 1,
    name: 'Beginner Piano',
    archive: false,
    dayOfLesson: 'Dienstag',
    startOfLesson: '16:00',
    durationMinutes: 45,
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    location: 'Studio B',
    endOfLesson: '16:45',
    homework_sharing_authorized: false,
    students: [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'Diana' },
    ],
  }),

  lesson: Object.freeze({
    id: 1,
    date: new Date('2023-12-01'),
    homework: 'Practice scales',
    lessonContent: 'Worked on Bach invention',
    expiration_base: '7d',
    homeworkKey: 'abc123',
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    studentId: 1,
    groupId: null,
    status: 'documented',
    attendance_status: 'held',
    absence_reason: null,
  }),

  note: Object.freeze({
    id: 1,
    text: 'This is a test note content',
    title: 'Test Note',
    backgroundColor: 'yellow' as const,
    order: 1,
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    studentId: 1,
    groupId: null,
  }),

  todo: Object.freeze({
    id: 1,
    text: 'Prepare lesson materials',
    completed: false,
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
    studentId: null,
    groupId: null,
    due: null,
  }),

  settings: Object.freeze({
    id: 1,
    lesson_main_layout: 'regular' as const,
    created_at: '2023-01-01T00:00:00Z',
    user_id: 'test-user-id',
  }),
})

/**
 * Optimized factory functions with pooling
 */
export function createMockStudent(
  overrides: Partial<DbStudent> = {},
): DbStudent {
  return getFromPool(
    'students',
    () => ({
      ...baseTemplates.student,
      ...overrides,
    }),
    overrides,
  )
}

export function createMockGroup(overrides: Partial<DbGroup> = {}): DbGroup {
  return getFromPool(
    'groups',
    () => ({
      ...baseTemplates.group,
      ...overrides,
    }),
    overrides,
  )
}

export function createMockLesson(overrides: Partial<any> = {}): any {
  return getFromPool(
    'lessons',
    () => ({
      ...baseTemplates.lesson,
      date: new Date(baseTemplates.lesson.date), // Create new Date instance
      ...overrides,
    }),
    overrides,
  )
}

export function createMockNote(overrides: Partial<DbNote> = {}): DbNote {
  return getFromPool(
    'notes',
    () => ({
      ...baseTemplates.note,
      ...overrides,
    }),
    overrides,
  )
}

export function createMockTodo(overrides: Partial<DbTodo> = {}): DbTodo {
  return getFromPool(
    'todos',
    () => ({
      ...baseTemplates.todo,
      ...overrides,
    }),
    overrides,
  )
}

export function createMockSettings(
  overrides: Partial<DbSettings> = {},
): DbSettings {
  return getFromPool(
    'settings',
    () => ({
      ...baseTemplates.settings,
      ...overrides,
    }),
    overrides,
  )
}

/**
 * Minimal factory variants for simple tests (faster creation)
 */
export function createMinimalStudent(
  id = 1,
): Pick<DbStudent, 'id' | 'firstName' | 'lastName'> {
  return {
    id,
    firstName: 'Test',
    lastName: 'Student',
  }
}

export function createMinimalGroup(id = 1): Pick<DbGroup, 'id' | 'name'> {
  return {
    id,
    name: 'Test Group',
  }
}

export function createMinimalLesson(
  id = 1,
): Pick<any, 'id' | 'date' | 'status'> {
  return {
    id,
    date: new Date('2023-12-01'),
    status: 'documented',
  }
}

/**
 * Optimized bulk creation methods
 */
export async function createBulkStudents(count: number): Promise<DbStudent[]> {
  const students: DbStudent[] = []

  // Use batch processing for large counts
  const batchSize = 50
  for (let i = 0; i < count; i += batchSize) {
    const batch = Math.min(batchSize, count - i)
    const batchStudents = Array.from({ length: batch }, (_, batchIndex) =>
      createMockStudent({
        id: i + batchIndex + 1,
        firstName: `Student${i + batchIndex + 1}`,
        lastName: 'Lastname',
      }),
    )
    students.push(...batchStudents)

    // Yield control for very large batches
    if (count > 100 && i % 100 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  return students
}

export async function createBulkGroups(count: number): Promise<DbGroup[]> {
  const groups: DbGroup[] = []

  for (let i = 0; i < count; i++) {
    groups.push(
      createMockGroup({
        id: i + 1,
        name: `Group ${i + 1}`,
      }),
    )
  }

  return groups
}

export async function createBulkLessons(count: number): Promise<any[]> {
  const lessons: any[] = []

  for (let i = 0; i < count; i++) {
    lessons.push(
      createMockLesson({
        id: i + 1,
        date: new Date(`2023-12-${(i + 1).toString().padStart(2, '0')}`),
        studentId: (i % 3) + 1,
      }),
    )
  }

  return lessons
}

export async function createBulkNotes(count: number): Promise<DbNote[]> {
  const colors: Array<Database['public']['Enums']['background_colors']> = [
    'yellow',
    'red',
    'blue',
    'green',
  ]

  const notes: DbNote[] = []
  for (let i = 0; i < count; i++) {
    notes.push(
      createMockNote({
        id: i + 1,
        text: `Note ${i + 1} content`,
        backgroundColor: colors[i % colors.length],
        order: i + 1,
      }),
    )
  }

  return notes
}

/**
 * Cached form data factories
 */
const formDataCache = new Map<string, any>()

export function createMockLessonFormData() {
  const key = 'lesson-form-data'
  if (formDataCache.has(key)) {
    return formDataCache.get(key)
  }

  const data = {
    date: '2023-12-01',
    homework: 'Practice scales',
    lessonContent: 'Worked on Bach invention',
    studentId: 1,
    groupId: undefined,
  }

  formDataCache.set(key, data)
  return data
}

export function createMockStudentFormData() {
  const key = 'student-form-data'
  if (formDataCache.has(key)) {
    return formDataCache.get(key)
  }

  const data = {
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    dayOfLesson: 'wednesday' as const,
    startOfLesson: '15:00',
    durationMinutes: 45,
    location: 'Studio C',
  }

  formDataCache.set(key, data)
  return data
}

export function createMockGroupFormData() {
  const key = 'group-form-data'
  if (formDataCache.has(key)) {
    return formDataCache.get(key)
  }

  const data = {
    name: 'Advanced Piano',
    dayOfLesson: 'thursday' as const,
    startOfLesson: '17:00',
    durationMinutes: 60,
    location: 'Studio D',
  }

  formDataCache.set(key, data)
  return data
}

/**
 * API response factories with caching
 */
export function createMockApiResponse<T>(data: T, error: any = null) {
  return {
    data,
    error,
    status: error ? 400 : 200,
    statusText: error ? 'Bad Request' : 'OK',
  }
}

export function createMockQueryResponse<T>(
  data: T,
  isLoading = false,
  error: any = null,
) {
  return {
    data,
    error,
    isLoading,
    isError: !!error,
    isSuccess: !error && !isLoading,
    refetch: () => Promise.resolve(),
    isFetching: isLoading,
    status: error ? 'error' : isLoading ? 'loading' : 'success',
  }
}

/**
 * Pool management functions
 */
export function warmupFactoryPools() {
  console.log('🔥 Warming up factory pools...')

  // Warm up with common variants
  warmupPool('students', () => ({ ...baseTemplates.student }), [
    {},
    { instrument: 'Guitar' },
    { instrument: 'Violin' },
    { archive: true },
  ])

  warmupPool('groups', () => ({ ...baseTemplates.group }), [
    {},
    { name: 'Advanced Group' },
  ])

  warmupPool(
    'lessons',
    () => ({
      ...baseTemplates.lesson,
      date: new Date(baseTemplates.lesson.date),
    }),
    [{}, { status: 'prepared' }, { status: 'documented' }],
  )

  warmupPool('notes', () => ({ ...baseTemplates.note }), [
    {},
    { backgroundColor: 'red' as const },
    { backgroundColor: 'blue' as const },
  ])

  console.log('✅ Factory pools warmed up')
}

export function clearFactoryPools() {
  for (const pool of Object.values(objectPools)) {
    pool.clear()
  }
  formDataCache.clear()
}

export function resetFactoryStats() {
  factoryStats = {
    totalCalls: 0,
    poolHits: 0,
    poolMisses: 0,
    hitRate: 0,
    averageCreationTime: 0,
    totalCreationTime: 0,
    memoryReused: 0,
  }
}

export function getFactoryStats(): FactoryStats {
  return { ...factoryStats }
}

export function printFactoryReport() {
  console.log('\n🏭 Factory Performance Report:')
  console.log(`  • Total factory calls: ${factoryStats.totalCalls}`)
  console.log(`  • Pool hit rate: ${factoryStats.hitRate.toFixed(1)}%`)
  console.log(
    `  • Average creation time: ${factoryStats.averageCreationTime.toFixed(3)}ms`,
  )
  console.log(
    `  • Memory reused: ${(factoryStats.memoryReused / 1024).toFixed(2)}KB`,
  )

  console.log('\n  Pool sizes:')
  for (const [type, pool] of Object.entries(objectPools)) {
    const totalObjects = Array.from(pool.values()).reduce(
      (sum, arr) => sum + arr.length,
      0,
    )
    console.log(
      `    • ${type}: ${totalObjects} objects in ${pool.size} variants`,
    )
  }
}

/**
 * Collection factory functions for backward compatibility with existing tests
 */
export function createMockStudents(count = 3): DbStudent[] {
  return Array.from({ length: count }, (_, index) =>
    createMockStudent({ id: index + 1 }),
  )
}

export function createMockGroups(count = 3): DbGroup[] {
  return Array.from({ length: count }, (_, index) =>
    createMockGroup({ id: index + 1 }),
  )
}

export function createMockLessons(count = 3): any[] {
  return Array.from({ length: count }, (_, index) =>
    createMockLesson({ id: index + 1 }),
  )
}

export function createMockNotes(count = 3): DbNote[] {
  return Array.from({ length: count }, (_, index) =>
    createMockNote({ id: index + 1 }),
  )
}

export function createMockTodos(count = 3): DbTodo[] {
  return Array.from({ length: count }, (_, index) =>
    createMockTodo({ id: index + 1 }),
  )
}

/**
 * Utility functions
 */
function estimateObjectSize(obj: any): number {
  return JSON.stringify(obj).length * 2 // Rough estimate
}

// Initialize pools on module load
warmupFactoryPools()
