import { FunctionComponent } from 'react'
import { TodosProvider } from './TodosContext'
import { NotesProvider } from './NotesContext'
import { LessonsProvider } from './LessonsContext'
import { StudentsProvider } from './StudentContext'
import { ClosestStudentProvider } from './ClosestStudentContext'
import { DateTodayProvider } from './DateTodayContext'

interface MainContextProps {
  children: React.ReactNode
}

const MainContext: FunctionComponent<MainContextProps> = ({ children }) => {
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
