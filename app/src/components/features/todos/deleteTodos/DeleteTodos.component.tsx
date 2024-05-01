import { useState } from "react";
import { toast } from "react-toastify";
import { useTodos } from "../../../../services/context/TodosContext";
import fetchErrorToast from "../../../../hooks/fetchErrorToast";
import Button from "../../../ui/button/Button.component";
import "./deleteTodos.style.scss";

interface DeleteTodosProps {
	todoId?: number;
	onCloseModal?: () => void;
}

function DeleteTodos({ todoId, onCloseModal }: DeleteTodosProps) {
	const { todos } = useTodos();
	const [isPending, setIsPending] = useState(false);
	const { deleteTodo, deleteAllCompleted } = useTodos();

	let text = "";
	if (todoId) {
		text = todos.find((todo) => todo.id === todoId).text;
	}

	const handlerDelete = async () => {
		setIsPending(true);
		try {
			if (todoId) {
				await deleteTodo(todoId);
			} else {
				await deleteAllCompleted();
			}
			onCloseModal?.();
			toast(`Todo${todoId ? "" : "s"} gelöscht.`);
		} catch (error) {
			fetchErrorToast();
		} finally {
			setIsPending(false);
		}
	};

	return (
		<div className={`delete-todos${isPending ? " loading" : ""}`}>
			<h2 className="heading-2">Todo{!todoId ? "s" : ""} löschen</h2>
			{todoId ? (
				<p>
					Die Todo <span className="delete-todos__todo-text">{text}</span> wird
					unwiederruflich gelöscht.
				</p>
			) : (
				<p>Alle erledigten Todos werden unwiederruflich gelöscht.</p>
			)}

			<div className="delete-todos__buttons">
				<Button type="button" btnStyle="secondary" onClick={onCloseModal}>
					Abbrechen
				</Button>
				<Button type="button" btnStyle="danger" onClick={handlerDelete}>
					Löschen
				</Button>
			</div>
		</div>
	);
}

export default DeleteTodos;
