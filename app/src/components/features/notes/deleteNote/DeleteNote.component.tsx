import { useState } from "react";
import { toast } from "react-toastify";
import { useNotes } from "../../../../services/context/NotesContext";
import fetchErrorToast from "../../../../hooks/fetchErrorToast";
import Button from "../../../ui/button/Button.component";
import "./deleteNote.style.scss";

interface DeleteNoteProps {
	onCloseModal?: () => void;
	noteId: number;
}

function DeleteNote({ onCloseModal, noteId }: DeleteNoteProps) {
	const [isPending, setIsPending] = useState(false);
	const { deleteNote } = useNotes();

	const handleDelete = async () => {
		setIsPending(true);
		try {
			await deleteNote(noteId);
			toast("Notitz gelöscht.");
			onCloseModal?.();
		} catch (error) {
			fetchErrorToast();
		} finally {
			setIsPending(false);
		}
	};

	return (
		<div className={`delete-note ${isPending ? "loading" : ""}`}>
			<h2 className="heading-2">Notiz löschen</h2>
			<p>Möchtest du diese Notiz wirklich löschen?</p>
			<div className="delete-note__buttons">
				<Button
					type="button"
					btnStyle="secondary"
					handler={onCloseModal}
					label="Abbrechen"
				/>
				<Button
					type="button"
					btnStyle="danger"
					handler={handleDelete}
					label="Löschen"
				/>
			</div>
		</div>
	);
}

export default DeleteNote;
