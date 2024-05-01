// import './overview.style.scss'

import { useClosestStudent } from "../../../../services/context/ClosestStudentContext";

import { useStudents } from "../../../../services/context/StudentContext";
import { useTodos } from "../../../../services/context/TodosContext";
import { sortStudentsDateTime } from "../../../../utils/sortStudents";

function Overview() {
	const { activeStudents, inactiveStudents } = useStudents();
	const { todos } = useTodos();
	const { closestStudentIndex } = useClosestStudent();
	const { overdueTodos } = useTodos();

	const sortedStudents =
		(activeStudents && sortStudentsDateTime(activeStudents)) || null;
	const closestStudent =
		(sortedStudents && sortedStudents[closestStudentIndex]) || null;

	const todosOpen = todos.filter((todo) => !todo.completed);

	return (
		<div className="col-span-2">
			<h2 className="heading-2">Übersicht</h2>
			<div className="overview__content">
				<div className="card overview__students">
					<h5 className="heading-3">Schüler:innen</h5>
					{activeStudents.length > 0 ? (
						<>
							<p>
								Aktive Schüler:innen: <b>{activeStudents.length}</b>
							</p>
							<p>
								Nächste Lektion:{" "}
								<b>
									{closestStudent?.firstName} {closestStudent?.lastName}
								</b>
							</p>
						</>
					) : (
						<p>Keine aktiven Schüler:innen erfasst</p>
					)}
					{inactiveStudents.length ? (
						<p>
							Archivierte Schüler:innen: <b>{inactiveStudents.length}</b>
						</p>
					) : (
						<p>Keine archivierten Schüler:innen</p>
					)}
				</div>

				<div className="card overview__todos">
					<h3 className="heading-3">Todos</h3>
					{todosOpen.length ? (
						<p>
							Offene Todos: <b>{todosOpen.length}</b>
						</p>
					) : (
						<p>Keine offenen Todos</p>
					)}
					{overdueTodos.length > 0 ? (
						<p className="todos-overdue">
							Überfällige Todos: <b>{overdueTodos.length}</b>
						</p>
					) : (
						<p>Keine Todos überfällig.</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default Overview;
