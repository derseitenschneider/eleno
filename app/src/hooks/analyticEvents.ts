import { logEvent } from "@firebase/analytics";
import analytics from "../services/analytics/firebaseAnalytics";
import { useClosestStudent } from "../services/context/ClosestStudentContext";
import getClosestStudentIndex from "../utils/getClosestStudentIndex";
import { useStudents } from "../services/context/StudentContext";

const usePageViewAnalytics = (e: React.MouseEvent) => {
	const { setClosestStudentIndex } = useClosestStudent();
	const { activeStudents } = useStudents();
	const target = e.target as HTMLElement;
	const path = target.closest("a").pathname;

	switch (path) {
		case "/":
			if (target.closest("a").target === "_blank")
				return logEvent(analytics, "page_view", { page_title: "manual" });

			setClosestStudentIndex(getClosestStudentIndex(activeStudents));
			return logEvent(analytics, "page_view", { page_title: "dashboard" });
			break;

		case "/lessons":
			return logEvent(analytics, "page_view", { page_title: "lessons" });
			break;

		case "/students":
			return logEvent(analytics, "page_view", { page_title: "students" });
			break;

		case "/timetable":
			return logEvent(analytics, "page_view", { page_title: "timetable" });
			break;

		case "/todos":
			return logEvent(analytics, "page_view", { page_title: "todos" });
			break;

		case "/settings":
			return logEvent(analytics, "page_view", { page_title: "todos" });
			break;

		default:
			return null;
	}
};

export default usePageViewAnalytics;
