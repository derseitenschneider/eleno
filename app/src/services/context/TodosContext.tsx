import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import {
	completeTodoSupabase,
	deleteCompletedTodosSupabase,
	deleteTodoSupabase,
	reactivateTodoSupabase,
	saveTodoSupabase,
	updateTodoSupabase,
} from "../api/todos.api";
import type { ContextTypeTodos, TTodo } from "../../types/types";
import { useDateToday } from "./DateTodayContext";
import { formatDateToDatabase } from "../../utils/formateDate";

export const TodosContext = createContext<ContextTypeTodos>({
	todos: [],
	setTodos: () => {},
	overdueTodos: [],
	saveTodo: () => new Promise(() => {}),
	deleteTodo: () => new Promise(() => {}),
	completeTodo: () => new Promise(() => {}),
	reactivateTodo: () => new Promise(() => {}),
	deleteAllCompleted: () => new Promise(() => {}),
	updateTodo: () => new Promise(() => {}),
});

export function TodosProvider({ children }: { children: React.ReactNode }) {
	const { dateToday } = useDateToday();
	const [todos, setTodos] = useState<TTodo[]>([]);

	const overdueTodos = todos.filter(
		(todo) => todo.due < formatDateToDatabase(dateToday) && !todo.completed,
	);

	const saveTodo = useCallback(async (newTodo: TTodo) => {
		try {
			const data = await saveTodoSupabase(newTodo);
			setTodos((prev) => [...prev, data]);
		} catch (error) {
			throw new Error(error.message);
		}
	}, []);

	const deleteTodo = useCallback(async (id: number) => {
		try {
			await deleteTodoSupabase(id);
			setTodos((prev) => prev.filter((todo) => todo.id !== id));
		} catch (error) {
			throw new Error(error.message);
		}
	}, []);

	const completeTodo = useCallback(async (id: number) => {
		try {
			await completeTodoSupabase(id);
			setTodos((prev) =>
				prev.map((todo) =>
					todo.id === id ? { ...todo, completed: true } : todo,
				),
			);
		} catch (error) {
			throw new Error(error.message);
		}
	}, []);

	const reactivateTodo = useCallback(async (id: number) => {
		try {
			await reactivateTodoSupabase(id);
			setTodos((prev) =>
				prev.map((todo) =>
					todo.id === id ? { ...todo, completed: false } : todo,
				),
			);
		} catch (error) {
			throw new Error(error.message);
		}
	}, []);

	const updateTodo = useCallback(async (editedTodo: TTodo) => {
		try {
			await updateTodoSupabase(editedTodo);
			setTodos((prev) => {
				return prev.map((todo) =>
					todo.id === editedTodo.id ? editedTodo : todo,
				);
			});
		} catch (error) {
			throw new Error(error.message);
		}
	}, []);

	const deleteAllCompleted = useCallback(async () => {
		try {
			await deleteCompletedTodosSupabase();
			setTodos((prev) => prev.filter((todo) => !todo.completed));
		} catch (error) {
			throw new Error(error.message);
		}
	}, []);

	const value = useMemo(
		() => ({
			todos,
			setTodos,
			overdueTodos,
			saveTodo,
			deleteTodo,
			completeTodo,
			reactivateTodo,
			deleteAllCompleted,
			updateTodo,
		}),
		[
			todos,
			setTodos,
			overdueTodos,
			saveTodo,
			deleteTodo,
			completeTodo,
			reactivateTodo,
			deleteAllCompleted,
			updateTodo,
		],
	);

	return (
		<TodosContext.Provider value={value}>{children}</TodosContext.Provider>
	);
}

export const useTodos = () => useContext(TodosContext);
