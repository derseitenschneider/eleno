import { LessonPointerProvider } from './LessonPointerContext'
import { DraftsProvider } from './DraftsContext'
import { StudentsProvider } from './StudentContext'
import { TodosProvider } from './TodosContext'

interface MainContextProps {
  children: React.ReactNode
}

function MainContext({ children }: MainContextProps) {
  return (
    <DraftsProvider>
      <StudentsProvider>
        <TodosProvider>
          <LessonPointerProvider>{children}</LessonPointerProvider>
        </TodosProvider>
      </StudentsProvider>
    </DraftsProvider>
  )
}

export default MainContext
