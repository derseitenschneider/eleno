import supabase from './supabase'

export const getNotificationsApi = async () => {
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('active', true)
    .lte('created_at', new Date().toISOString())
    .gte('expires_at', new Date().toISOString())
    .limit(1)

  if (error) throw new Error(error.message)
  return notifications
}

export const getNotificationViewsApi = async (
  notificationId: number,
  userId: string,
) => {
  const { data: views, error } = await supabase
    .from('notification_views')
    .select('*')
    .eq('notification_id', notificationId)
    .eq('user_id', userId)
    .limit(1)

  if (error) throw new Error(error.message)
  return views
}
