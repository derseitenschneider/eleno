import type {
  Notification as DbNotification,
  NotificationView,
} from '@/types/types' // Adjust paths as needed
import supabase from './supabase'

/**
 * Fetches active and non-expired notifications.
 */
export const getNotificationsApi = async (): Promise<DbNotification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('active', true)
    .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`)

  if (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
  return (data as DbNotification[]) || []
}

/**
 * Fetches notification views for a user and specific notification IDs.
 */
export const getNotificationViewsApi = async (
  userId: string,
  notificationIds: number[], // or bigint[]
): Promise<NotificationView[]> => {
  if (!userId || notificationIds.length === 0) {
    return []
  }
  const { data, error } = await supabase
    .from('notification_views')
    .select('*')
    .eq('user_id', userId)
    .in('notification_id', notificationIds)

  if (error) {
    console.error('Error fetching notification views:', error)
    throw error
  }
  return (data as NotificationView[]) || []
}

/**
 * Payload for creating a notification view.
 */
export type CreateNotificationViewPayload = {
  notification_id: number // or bigint
  user_id: string
  action_taken: 'dismissed' | 'completed' | 'clicked' // from your enum
  results: Record<string, string | string[]> | null
}

/**
 * Creates a new notification view record.
 */
export const createNotificationViewApi = async (
  payload: CreateNotificationViewPayload,
): Promise<NotificationView> => {
  const { data, error } = await supabase
    .from('notification_views')
    .insert({
      ...payload,
      viewed_at: new Date().toISOString(), // Set viewed_at timestamp on interaction
    })
    .select()
    .single() // Expecting a single record back

  if (error) {
    console.error('Error creating notification view:', error)
    throw error
  }
  return data as NotificationView
}
