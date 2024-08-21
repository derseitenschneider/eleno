import { LessonHolderProvider } from './LessonHolderContext'
import { DraftsProvider } from './DraftsContext'

interface MainContextProps {
  children: React.ReactNode
}

function MainContext({ children }: MainContextProps) {
  return (
    <DraftsProvider>
      <LessonHolderProvider>{children}</LessonHolderProvider>
    </DraftsProvider>
  )
}

export default MainContext
