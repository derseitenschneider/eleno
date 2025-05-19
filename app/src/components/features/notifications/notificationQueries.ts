import {
  getNotificationsApi,
  getNotificationViewsApi,
} from '@/services/api/notifications.api'
import { useUser } from '@/services/context/UserContext'
import { useQuery } from '@tanstack/react-query'

export function useNotificationsQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!user) return
      const notifications = await getNotificationsApi()
      const views = await getNotificationViewsApi(user.id, notifications)

      // Filter notifications based on view status
      const notificationsWithStatus = notifications.map((notification) => {
        const view = views?.find((v) => v.notification_id === notification.id)
        return {
          ...notification,
          viewed: !!view,
          action_taken: view?.action_taken,
        }
      })

      // Filter out "once" frequency notifications that have been viewed
      const filteredNotifications = notificationsWithStatus.filter((n) => {
        if (n.display_frequency === 'once' && n.viewed) return false
        return true
      })

      // Sort based on created at time
      const sortedNotifications = filteredNotifications.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      return sortedNotifications[0] || null
    },
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 60 * 24,
  })

  return result
}
