import { TStudent } from "./Students.type"

export type ContextType = {students: TStudent[] | null, setStudents: React.Dispatch<React.SetStateAction<TStudent[]>>
}