import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { TTimetableDay } from "../../../types/types";
import BaseLayoutPDF from "./BaseLayoutPDF.component";
import TablePDF from "./TablePDF.component";

interface TimetablePDFProps {
	days: TTimetableDay[];
	title: string;
	userName: string;
}

const styles = StyleSheet.create({
	day: {
		marginBottom: "48px",
		border: "1px solid #e2e8f0",
	},
	head: {
		padding: "8px 5px",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "baseline",
		marginBottom: "6px",
	},
	tableHeading: {
		fontSize: "12px",
		textTransform: "uppercase",
	},

	col1: { width: "20%", padding: "8px 5px" },
	col2: { width: "30%", padding: "8px 5px" },
	col3: { width: "30%", padding: "8px 5px" },
	col4: { width: "30%", padding: "8px 5px" },
});

function TimetablePDF({ days, title, userName }: TimetablePDFProps) {
	return (
		<BaseLayoutPDF
			title={title || `Stundenplan ${userName}`}
			orientation="portrait"
		>
			{days.map((day) => (
				<View key={day.day} wrap={false} style={styles.day}>
					<View style={styles.head}>
						<Text style={styles.tableHeading}>{day.day}</Text>
						<Text>Anz. Schüler:innen: {day.students.length}</Text>
					</View>
					<TablePDF.Head>
						<Text style={styles.col1}>Zeit</Text>
						<Text style={styles.col2}>Schüler:in</Text>
						<Text style={styles.col3}>Instrument</Text>
						<Text style={styles.col4}>Ort</Text>
					</TablePDF.Head>

					{day.students.map((student, index) => (
						<View key={student.id}>
							<TablePDF index={index}>
								<Text style={styles.col1}>
									{student.startOfLesson} - {student.endOfLesson}
								</Text>
								<Text style={styles.col2}>
									{student.firstName} {student.lastName}
								</Text>
								<Text style={styles.col3}>{student.instrument}</Text>
								<Text style={styles.col4}>{student.location}</Text>
							</TablePDF>
						</View>
					))}
				</View>
			))}
		</BaseLayoutPDF>
	);
}

export default TimetablePDF;
