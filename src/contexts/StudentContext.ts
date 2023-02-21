import { useOutletContext } from "react-router-dom";
import { ContextType } from "../types/StudentContext.type.js";

export function useStudents() {
  return useOutletContext<ContextType>();
}