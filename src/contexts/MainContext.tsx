import { FunctionComponent } from 'react'
import { TodosProvider } from './TodosContext'
import { NotesProvider } from './NotesContext'
import { LessonsProvider } from './LessonsContext'
import { StudentsProvider } from './StudentContext'
import { LoadingProvider } from './LoadingContext'
import { ClosestStudentProvider } from './ClosestStudentContext'
import { DateTodayProvider } from './DateTodayContext'

interface MainContextProps {
  children: React.ReactNode
}

const MainContext: FunctionComponent<MainContextProps> = ({ children }) => {
  return (
    <DateTodayProvider>
      <StudentsProvider>
        <LessonsProvider>
          <NotesProvider>
            <TodosProvider>
              <ClosestStudentProvider>{children}</ClosestStudentProvider>
            </TodosProvider>
          </NotesProvider>
        </LessonsProvider>
      </StudentsProvider>
    </DateTodayProvider>
  )
}

export default MainContext
