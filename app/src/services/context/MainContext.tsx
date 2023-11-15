import { ClosestStudentProvider } from './ClosestStudentContext'
import { DateTodayProvider } from './DateTodayContext'
import { LessonsProvider } from './LessonsContext'
import { NotesProvider } from './NotesContext'
import { StudentsProvider } from './StudentContext'
import { TodosProvider } from './TodosContext'

interface MainContextProps {
  children: React.ReactNode
}

function MainContext({ children }: MainContextProps) {
  return (
    <DateTodayProvider>
      <LessonsProvider>
        <NotesProvider>
          <StudentsProvider>
            <TodosProvider>
              <ClosestStudentProvider>{children}</ClosestStudentProvider>
            </TodosProvider>
          </StudentsProvider>
        </NotesProvider>
      </LessonsProvider>
    </DateTodayProvider>
  )
}

export default MainContext
