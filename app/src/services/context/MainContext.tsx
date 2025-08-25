import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useProfileQuery from '@/components/features/user/profileQuery'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { DraftsProvider } from './DraftsContext'
import { LessonHolderProvider } from './LessonHolderContext'
import { MessagesProvider } from './MessagesContext'
import { useUser } from './UserContext'

interface MainContextProps {
  children: React.ReactNode
}

function MainContext({ children }: MainContextProps) {
  const { data } = useProfileQuery()
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!data || !user) return
    if (data.first_name === null) {
      // Users from email or oauth signup that have no profile data
      // yet but a password.
      navigate('/onboarding/profile')
    } else if (user.user_metadata.from_funnel) {
      // Users from funnel that have no password yet but profile data.
      navigate('/onboarding/password')
    }
  }, [data, data?.first_name, navigate, user?.user_metadata.from_funnel, user])

  return (
    <MessagesProvider>
      <DraftsProvider>
        <LessonHolderProvider>{children}</LessonHolderProvider>
      </DraftsProvider>
    </MessagesProvider>
  )
}

export default MainContext
