import type { TLesson } from "../types/types";

const sortDate = (a: TLesson, b: TLesson) => {
	return (
		+b.date.split("-").reduce((acc, curr) => acc + curr) -
		+a.date.split("-").reduce((acc, curr) => acc + curr)
	);
};

export default sortDate;
