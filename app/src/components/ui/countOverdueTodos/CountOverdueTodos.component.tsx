import { useTodos } from "../../../services/context/TodosContext";
import "./countOverdueTodos.style.scss";

export default function CountOverdueTodos() {
	const { overdueTodos } = useTodos();

	if (overdueTodos.length === 0) return null;

	return <div className="count-overdue">{overdueTodos.length}</div>;
}
