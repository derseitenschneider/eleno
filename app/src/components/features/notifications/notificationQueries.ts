import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type CreateNotificationViewPayload,
  createNotificationViewApi,
  getNotificationsApi,
  getNotificationViewsApi,
} from '@/services/api/notifications.api'
import { useUser } from '@/services/context/UserContext'
import type { Notification, NotificationView } from '@/types/types'

export function useNotificationsQuery() {
  const { user } = useUser()
  const queryClient = useQueryClient() // Get query client for potential manual cache updates if needed

  const result = useQuery<Notification | null, Error>({
    queryKey: ['notifications', user?.id], // User ID in query key for user-specific notifications
    queryFn: async () => {
      if (!user) return null

      const notifications = await getNotificationsApi()
      if (!notifications || notifications.length === 0) {
        return null
      }

      const notificationIds = notifications.map((n) => n.id)
      const views = await getNotificationViewsApi(user.id, notificationIds)

      // Combine notifications with their view data
      const notificationsWithViewInfo = notifications.map((notification) => {
        const userViewsForThisNotification = views.filter(
          (v) => v.notification_id === notification.id,
        )
        // Check if there's any view that marks it as "completed" or "dismissed"
        const hasBeenCompletedOrDismissed = userViewsForThisNotification.some(
          (v) =>
            v.action_taken === 'completed' || v.action_taken === 'dismissed',
        )
        // Get the most recent view, if any (could be for 'clicked' or just 'viewed')
        const mostRecentView = userViewsForThisNotification.sort(
          (a, b) =>
            new Date(b.viewed_at || 0).getTime() -
            new Date(a.viewed_at || 0).getTime(),
        )[0]

        return {
          ...notification,
          has_been_completed_or_dismissed: hasBeenCompletedOrDismissed,
          last_viewed_at: mostRecentView?.viewed_at, // Store when it was last viewed/interacted with
          // views: userViewsForThisNotification, // Could be useful for more complex logic
        }
      })

      // Filter notifications
      const eligibleNotifications = notificationsWithViewInfo.filter((n) => {
        // 1. If already completed or dismissed by the user, never show again (unless specific re-trigger logic is added)
        if (n.has_been_completed_or_dismissed) {
          // Exception: if display_frequency is 'always', we might allow re-showing,
          // but for now, completed/dismissed is a strong signal to hide.
          // This means 'always' would only re-show if the user *hasn't* completed/dismissed.
          return false
        }

        // 2. Handle display_frequency
        if (n.display_frequency === 'once') {
          // If 'once' and has *any* view record (meaning it was shown and some interaction, even just loading it, might have created a view)
          // The current logic of your NotificationManager creates a view only on dismiss/submit.
          // If we consider "loaded" as "viewed" then `n.last_viewed_at` would signify this.
          // For 'once', if it has been actioned upon (completed/dismissed), it's already filtered.
          // If it hasn't been actioned, it's a candidate.
          // The main check for 'once' is `has_been_completed_or_dismissed`.
        } else if (n.display_frequency === 'daily') {
          if (n.last_viewed_at) {
            const today = new Date().setHours(0, 0, 0, 0)
            const lastViewedDate = new Date(n.last_viewed_at).setHours(
              0,
              0,
              0,
              0,
            )
            if (lastViewedDate === today) {
              return false // Already viewed or actioned today
            }
          }
        }
        // For 'always', or 'once'/'daily' that haven't been filtered yet, they are eligible
        return true
      })

      // Sort eligible notifications by creation date (newest first)
      const sortedNotifications = eligibleNotifications.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )

      return sortedNotifications[0] || null // Return the top candidate or null
    },
    enabled: !!user, // Only run if the user object exists
    staleTime: 1000 * 60 * 5, // Consider how fresh this data needs to be (5 minutes)
    // refetchOnWindowFocus: true, // Optionally refetch when window gains focus
  })

  return result
}

export function useCreateNotificationView() {
  const queryClient = useQueryClient()
  const { user } = useUser() // To invalidate the correct query

  // const fetchErrorToast = useFetchErrorToast(); // Your optional global error toast

  return useMutation<NotificationView, Error, CreateNotificationViewPayload>({
    mutationFn: createNotificationViewApi,
    onSuccess: (data, variables) => {
      // When a view is successfully created, we should refetch the notifications list
      // so the just-interacted-with notification is re-evaluated (and likely hidden).
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] })

      // Optionally, you could provide a success toast, but usually, it's silent.
      // toast.success('Notification interaction recorded');
    },
    onError: (error, variables, context) => {
      // Handle the error, e.g., show a toast notification
      console.error('Failed to record notification view:', error.message)
      // fetchErrorToast(); // Or your custom error handling
      // toast.error('Could not save notification interaction.');
    },
    // You can use onMutate for optimistic updates if desired, but for this,
    // invalidation is usually sufficient.
  })
}
