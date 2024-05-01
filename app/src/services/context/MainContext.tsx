import { ClosestStudentProvider } from "./ClosestStudentContext";
import { DarkModeProvider } from "./DarkModeContext";
import { DateTodayProvider } from "./DateTodayContext";
import { GroupsProvider } from "./GroupsContext";
import { LessonsProvider } from "./LessonsContext";
import { NotesProvider } from "./NotesContext";
import { StudentsProvider } from "./StudentContext";
import { TodosProvider } from "./TodosContext";

interface MainContextProps {
	children: React.ReactNode;
}

function MainContext({ children }: MainContextProps) {
	return (
		<DarkModeProvider>
			<DateTodayProvider>
				<LessonsProvider>
					<NotesProvider>
						<StudentsProvider>
							<GroupsProvider>
								<TodosProvider>
									<ClosestStudentProvider>{children}</ClosestStudentProvider>
								</TodosProvider>
							</GroupsProvider>
						</StudentsProvider>
					</NotesProvider>
				</LessonsProvider>
			</DateTodayProvider>
		</DarkModeProvider>
	);
}

export default MainContext;
