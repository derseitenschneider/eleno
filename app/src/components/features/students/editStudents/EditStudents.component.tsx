import { type SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useStudents } from "../../../../services/context/StudentContext";
import fetchErrorToast from "../../../../hooks/fetchErrorToast";

import Button from "../../../ui/button/Button.component";
import "./editStudent.style.scss";
import EditStudentRow from "../editStudentRow/EditStudentRow.component";

interface EditStudentsProps {
	onCloseModal?: () => void;
	studentIds: number[];
	setSelectedStudents?: React.Dispatch<SetStateAction<number[]>>;
}

function EditStudents({
	onCloseModal,
	studentIds,
	setSelectedStudents,
}: EditStudentsProps) {
	const { students, updateStudents } = useStudents();

	const [inputStudents, setInputStudents] = useState(
		studentIds.map((id) => students.find((student) => student.id === id)),
	);

	const [isPending, setIsPending] = useState(false);
	const grid = "repeat(3, 1fr) 16rem repeat(2, 6.5rem) 7rem 1fr";

	const disableSave =
		inputStudents.filter(
			(student) =>
				!student.firstName || !student.lastName || !student.instrument,
		).length > 0;

	useEffect(() => {
		if (studentIds.length === 0) onCloseModal();
	}, [onCloseModal, studentIds]);

	const handleOnSave = async () => {
		setIsPending(true);
		try {
			await updateStudents(inputStudents);
			toast("Änderungen gespeichert");
			setSelectedStudents?.([]);
			onCloseModal?.();
		} catch (err) {
			fetchErrorToast();
		} finally {
			setIsPending(false);
		}
	};

	return (
		<div className="edit-students">
			<h2 className="heading-2">
				Schüler:in{studentIds.length > 1 ? "nen" : ""} bearbeiten
			</h2>
			<div className={`edit-students__grid ${isPending ? " loading" : ""}`}>
				<div className="labels" style={{ gridTemplateColumns: grid }}>
					<span>Vorname*</span>
					<span>Nachname*</span>
					<span>Instrument*</span>
					<span>Tag</span>
					<span>Von</span>
					<span>Bis</span>
					<span>Dauer</span>
					<span>Ort</span>
				</div>

				{inputStudents.map((student) => (
					<EditStudentRow
						student={student}
						setInputStudents={setInputStudents}
						key={student.id}
					/>
				))}
				<div className="edit-students__info">
					<p>* Pflichtfelder</p>
				</div>
			</div>
			<div className="edit-students__buttons">
				<Button
					type="button"
					btnStyle="secondary"
					label="Abbrechen"
					handler={onCloseModal}
					disabled={isPending}
				/>
				<Button
					type="button"
					btnStyle="primary"
					label="Speichern"
					handler={handleOnSave}
					disabled={disableSave || isPending}
				/>
			</div>
		</div>
	);
}

export default EditStudents;
