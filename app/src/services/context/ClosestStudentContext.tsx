import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ContextTypeClosestStudent } from "../../types/types";
import getClosestStudentIndex from "../../utils/getClosestStudentIndex";
import { useStudents } from "./StudentContext";

export const ClosestStudentContext = createContext<ContextTypeClosestStudent>({
	closestStudentIndex: 0,
	setClosestStudentIndex: () => {},
});

export function ClosestStudentProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { students } = useStudents();
	const [closestStudentIndex, setClosestStudentIndex] = useState<number>(0);

	useEffect(() => {
		if (students) {
			setClosestStudentIndex(getClosestStudentIndex(students));
		}
	}, [students]);
	const value = useMemo(
		() => ({ closestStudentIndex, setClosestStudentIndex }),
		[closestStudentIndex, setClosestStudentIndex],
	);
	return (
		<ClosestStudentContext.Provider value={value}>
			{children}
		</ClosestStudentContext.Provider>
	);
}

export const useClosestStudent = () => useContext(ClosestStudentContext);
