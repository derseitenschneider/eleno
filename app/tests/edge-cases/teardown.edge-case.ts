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
      console.log('Cleaning up test data for user:', testData.userId)

      // Delete all lessons created during tests
      if (
        testData.mainStudentLessonIds &&
        testData.mainStudentLessonIds.length > 0
      ) {
        const { error: lessonsError } = await supabaseAdmin
          .from('lessons')
          .delete()
          .in('id', testData.mainStudentLessonIds)

        if (lessonsError) {
          console.warn(
            'Error deleting main student lessons:',
            lessonsError.message,
          )
        } else {
          console.log(
            `Deleted ${testData.mainStudentLessonIds.length} main student lessons`,
          )
        }
      }

      if (
        testData.additionalLessonIds &&
        testData.additionalLessonIds.length > 0
      ) {
        const { error: additionalLessonsError } = await supabaseAdmin
          .from('lessons')
          .delete()
          .in('id', testData.additionalLessonIds)

        if (additionalLessonsError) {
          console.warn(
            'Error deleting additional student lessons:',
            additionalLessonsError.message,
          )
        } else {
          console.log(
            `Deleted ${testData.additionalLessonIds.length} additional student lessons`,
          )
        }
      }

      if (testData.groupLessonIds && testData.groupLessonIds.length > 0) {
        const { error: groupLessonsError } = await supabaseAdmin
          .from('lessons')
          .delete()
          .in('id', testData.groupLessonIds)

        if (groupLessonsError) {
          console.warn(
            'Error deleting group lessons:',
            groupLessonsError.message,
          )
        } else {
          console.log(`Deleted ${testData.groupLessonIds.length} group lessons`)
        }
      }

      // Delete repertoire items if they exist
      if (testData.repertoireItemIds && testData.repertoireItemIds.length > 0) {
        const { error: repertoireError } = await supabaseAdmin
          .from('repertoire')
          .delete()
          .in('id', testData.repertoireItemIds)

        if (repertoireError) {
          console.warn(
            'Error deleting repertoire items (table might not exist):',
            repertoireError.message,
          )
        } else {
          console.log(
            `Deleted ${testData.repertoireItemIds.length} repertoire items`,
          )
        }
      }

      // Delete all students created during tests
      const studentIdsToDelete = [
        testData.defaultStudentId,
        ...(testData.additionalStudentIds || []),
        ...(testData.inactiveStudentIds || []),
      ].filter((id) => id) // Filter out any undefined/null values

      if (studentIdsToDelete.length > 0) {
        const { error: studentsError } = await supabaseAdmin
          .from('students')
          .delete()
          .in('id', studentIdsToDelete)

        if (studentsError) {
          console.warn('Error deleting students:', studentsError.message)
        } else {
          console.log(`Deleted ${studentIdsToDelete.length} students`)
        }
      }

      // Delete group if it exists
      if (testData.groupId) {
        const { error: groupError } = await supabaseAdmin
          .from('groups')
          .delete()
          .eq('id', testData.groupId)

        if (groupError) {
          console.warn('Error deleting group:', groupError.message)
        } else {
          console.log('Deleted test group')
        }
      }

      // Delete feature flag user relationship
      const { error: featureFlagError } = await supabaseAdmin
        .from('feature_flag_users')
        .delete()
        .eq('user_id', testData.userId)

      if (featureFlagError) {
        console.warn(
          'Error deleting feature flag user:',
          featureFlagError.message,
        )
      } else {
        console.log('Deleted feature flag user relationship')
      }

      // Delete subscription
      const { error: subscriptionError } = await supabaseAdmin
        .from('stripe_subscriptions')
        .delete()
        .eq('user_id', testData.userId)

      if (subscriptionError) {
        console.warn('Error deleting subscription:', subscriptionError.message)
      } else {
        console.log('Deleted test subscription')
      }

      // Finally, delete the user
      const { error: userError } = await supabaseAdmin.auth.admin.deleteUser(
        testData.userId,
      )

      if (userError) {
        console.error('Error deleting user:', userError.message)
        // Still continue with cleanup even if user deletion fails
      } else {
        console.log('Deleted test user successfully')
      }

      console.log('Edge-case test data cleaned up successfully')
    } catch (error) {
      console.error('Error during edge-case test cleanup:', error)
    }
  } else {
    console.log('No test data file found for cleanup')
  }

  // Clean up auth files
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true })
    console.log('Cleaned up auth directory')
  }
})
