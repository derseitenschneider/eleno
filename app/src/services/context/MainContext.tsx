import { LessonPointerProvider } from './LessonPointerContext'
import { DateTodayProvider } from './DateTodayContext'
import { GroupsProvider } from './GroupsContext'
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
            <GroupsProvider>
              <TodosProvider>
                <LessonPointerProvider>{children}</LessonPointerProvider>
              </TodosProvider>
            </GroupsProvider>
          </StudentsProvider>
        </NotesProvider>
      </LessonsProvider>
    </DateTodayProvider>
  )
}

export default MainContext
