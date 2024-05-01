export const formatDateToDisplay = (date: string): string => {
	return date.slice(2).split("-").reverse().join(".");
};

export const formatDateToDatabase = (date: string): string => {
	return date
		.split(".")
		.reverse()
		.map((el) => el.padStart(2, "0"))
		.join("-");
};
