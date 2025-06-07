import { LessonHolderProvider } from './LessonHolderContext'
import { DraftsProvider } from './DraftsContext'
import { MessagesProvider } from './MessagesContext'

interface MainContextProps {
  children: React.ReactNode
}

function MainContext({ children }: MainContextProps) {
  return (
    <MessagesProvider>
      <DraftsProvider>
        <LessonHolderProvider>{children}</LessonHolderProvider>
      </DraftsProvider>
    </MessagesProvider>
  )
}

export default MainContext
