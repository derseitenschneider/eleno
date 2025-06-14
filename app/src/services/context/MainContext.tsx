import { LessonHolderProvider } from './LessonHolderContext'
import { DraftsProvider } from './DraftsContext'
import { MessagesProvider } from './MessagesContext'
import useProfileQuery from '@/components/features/user/profileQuery'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface MainContextProps {
  children: React.ReactNode
}

function MainContext({ children }: MainContextProps) {
  const { data } = useProfileQuery()
  const navigate = useNavigate()

  useEffect(() => {
    if (!data) return
    if (data.first_name === null) {
      navigate('/onboarding')
    }
  }, [data, data?.first_name, navigate])

  return (
    <MessagesProvider>
      <DraftsProvider>
        <LessonHolderProvider>{children}</LessonHolderProvider>
      </DraftsProvider>
    </MessagesProvider>
  )
}

export default MainContext
