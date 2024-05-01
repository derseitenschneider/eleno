import { RxReset } from "react-icons/rx";
// Hooks
// Components
import { createContext, useContext, useMemo, useState } from "react";

import { HiTrash } from "react-icons/hi2";

import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import fetchErrorToast from "../../../../hooks/fetchErrorToast";
import type { TSorting } from "../../../../types/types";
import { sortStudents } from "../../../../utils/sortStudents";
import Menus from "../../../ui/menu/Menus.component";
import Table from "../../../ui/table/Table.component";
import StudentsTable from "../studentsTable/StudentsTable.component";

import { useStudents } from "../../../../services/context/StudentContext";
import Button from "../../../ui/button/Button.component";
import Modal from "../../../ui/modal/Modal.component";
import SearchBar from "../../../ui/searchBar/SearchBar.component";
import Select from "../../../ui/select/Select.component";
import DeleteStudents from "../deleteStudents/DeleteStudents.component";
import InachtiveStudentRow from "./InactiveStudentRow.component";

type ContextTypeInactiveStudents = {
	selectedStudents: number[];
	setSelectedStudents: React.Dispatch<React.SetStateAction<number[]>>;
};

const InactiveStudentsContext =
	createContext<ContextTypeInactiveStudents>(null);

function InactiveStudents() {
	const { reactivateStudents, inactiveStudents } = useStudents();
	const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
	const [action, setAction] = useState("");
	const [searchInput, setSearchInput] = useState("");

	const [searchParams, setSearchParams] = useSearchParams();

	const filteredStudents = inactiveStudents?.filter(
		(student) =>
			student.firstName.toLowerCase().includes(searchInput) ||
			student.lastName.toLocaleLowerCase().includes(searchInput) ||
			student.instrument.toLocaleLowerCase().includes(searchInput) ||
			student.location.toLocaleLowerCase().includes(searchInput) ||
			student.dayOfLesson.toLocaleLowerCase().includes(searchInput),
	);

	const sorting: TSorting = {
		sort: searchParams.get("sort"),
		ascending: searchParams.get("asc"),
	};

	const sortedStudents = sortStudents(filteredStudents, sorting);

	const handlerAction = async () => {
		if (action === "Wiederherstellen") {
			try {
				await reactivateStudents(selectedStudents);
				toast(
					`Schüler:in${
						selectedStudents.length > 1 ? "nen" : ""
					} wiederhergestellt`,
				);
				setAction("");
				setSelectedStudents([]);
			} catch (error) {
				fetchErrorToast();
			}
		}

		if (action === "Löschen") {
			searchParams.append("modal", "multi-delete-students");
			setSearchParams(searchParams);

			setAction("");
		}
	};
	const value = useMemo(
		() => ({
			selectedStudents,
			setSelectedStudents,
		}),
		[selectedStudents],
	);

	return (
		<InactiveStudentsContext.Provider value={value}>
			<div className="students">
				<div className="header">
					<div className="container--heading">
						<span>Archivierte Schüler:innen: {inactiveStudents.length}</span>
					</div>
					<div className="container--controls">
						<Select
							selected={action}
							setSelected={setAction}
							label="Aktion"
							disabled={selectedStudents.length === 0}
							options={[
								{ name: "Wiederherstellen", icon: <RxReset /> },
								{
									name: "Löschen",
									icon: <HiTrash />,
									iconColor: "var(--clr-warning)",
								},
							]}
						/>

						{action && selectedStudents.length ? (
							<Button
								label="Anwenden"
								btnStyle="primary"
								type="button"
								handler={handlerAction}
							/>
						) : null}
						<Modal>
							<Modal.Open opens="multi-delete-students" />
							<Modal.Window name="multi-delete-students">
								<DeleteStudents />
							</Modal.Window>
						</Modal>

						<div className="container-right">
							<SearchBar
								searchInput={searchInput}
								handlerSearchInput={(e) =>
									setSearchInput(e.target.value.toLowerCase())
								}
							/>
						</div>
					</div>
				</div>

				<StudentsTable
					isSelected={selectedStudents}
					setIsSelected={setSelectedStudents}
					students={filteredStudents}
				>
					<Menus>
						<Table.Body
							data={sortedStudents}
							render={(student) => (
								<Menus.Menu key={student.id}>
									<InachtiveStudentRow student={student} />
								</Menus.Menu>
							)}
							emptyMessage="Keine archivierten Schüler:innen vorhanden"
						/>
					</Menus>
				</StudentsTable>
			</div>
		</InactiveStudentsContext.Provider>
	);
}

export default InactiveStudents;

export const useInactiveStudents = () => {
	const context = useContext(InactiveStudentsContext);
	return context;
};
