import { test as teardown } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'
import supabaseAdmin from '../utils/supabaseAdmin'

/**
 * Cleanup test data created for edge-case visual regression tests
 */
teardown('cleanup edge-case test data', async () => {
  const authDir = './tests/edge-cases/.auth'
  const testDataPath = path.join(authDir, 'test-data.json')
  
  if (fs.existsSync(testDataPath)) {
    try {
      const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'))
      
      // Collect all student IDs
      const allStudentIds = [
        testData.defaultStudentId,
        ...(testData.additionalStudentIds || []),
        ...(testData.inactiveStudentIds || []),
      ].filter(Boolean)
      
      // Delete in reverse order of creation to handle foreign key constraints
      
      // Delete repertoire items
      if (allStudentIds.length > 0) {
        await supabaseAdmin
          .from('repertoire')
          .delete()
          .in('student_id', allStudentIds)
      }
      
      // Delete lessons
      if (allStudentIds.length > 0) {
        await supabaseAdmin
          .from('lessons')
          .delete()
          .in('student_id', allStudentIds)
      }
      
      // Delete the group
      if (testData.groupId) {
        await supabaseAdmin
          .from('groups')
          .delete()
          .eq('id', testData.groupId)
      }
      
      // Delete students
      if (allStudentIds.length > 0) {
        await supabaseAdmin
          .from('students')
          .delete()
          .in('id', allStudentIds)
      }
      
      // Delete subscription row
      if (testData.userId) {
        await supabaseAdmin
          .from('stripe_subscriptions')
          .delete()
          .eq('user_id', testData.userId)
      }
      
      // Delete the test user from auth
      if (testData.userId) {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(testData.userId)
        if (error) {
          console.error('Error deleting test user:', error)
        }
      }
      
      console.log('Edge-case test data cleaned up successfully')
    } catch (error) {
      console.error('Error during edge-case test cleanup:', error)
    }
  }
  
  // Clean up auth files
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true })
  }
})