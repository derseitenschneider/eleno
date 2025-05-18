import supabase from '@/services/api/supabase'
import { useUser } from '@/services/context/UserContext'
import { useEffect, useState } from 'react'

export function NotificationManager() {
  const [notification, setNotification] = useState<Notification | null>(null)
  const [response, setResponse] = useState({})
  const [isVisible, setIsVisible] = useState(false)
  const user = useUser()

  useEffect(() => {
    if (!user) return
    const fetchNotifications = async () => {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('active', true)
        .lte('created_at', new Date().toISOString())
        .gte('expires_at', new Date().toISOString())
        .limit(1)

      console.log(notifications)
    }

    fetchNotifications()
  }, [user])

  return null
}
