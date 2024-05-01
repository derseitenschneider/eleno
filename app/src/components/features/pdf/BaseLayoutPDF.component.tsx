import {
	Document,
	Font,
	Page,
	Path,
	StyleSheet,
	Svg,
	Text,
	View,
} from "@react-pdf/renderer";

import fontBold from "../../../assets/fonts/DM_Sans/DMSans-Bold.ttf";
import fontItalic from "../../../assets/fonts/DM_Sans/DMSans-BoldItalic.ttf";
import fontRegular from "../../../assets/fonts/DM_Sans/DMSans-Regular.ttf";

Font.register({
	family: "DM Sans",
	fonts: [
		{ src: fontRegular, fontStyle: "normal", fontWeight: "normal" },
		{ src: fontBold, fontStyle: "normal", fontWeight: "bold" },
		{ src: fontItalic, fontStyle: "italic", fontWeight: "normal" },
	],
});

interface BaseLayoutPDFProps {
	children: React.ReactNode;

	title: string;
	orientation: "portrait" | "landscape";
}

const styles = StyleSheet.create({
	page: {
		paddingTop: "1.9cm",
		paddingBottom: "1.5cm",
		paddingHorizontal: "1.5cm",
		fontFamily: "DM Sans",
		fontSize: "10px",
	},
	header: {
		fontSize: "16px",
		marginBottom: "24px",
	},
	logoBox: {
		position: "absolute",
		top: "5mm",
		left: "15mm",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: "2px",
	},
	logoText: {
		fontSize: "12px",
		fontWeight: "bold",
		letterSpacing: "-1px",
		color: "#4794AE",
	},
	logo: {
		height: ".75cm",
		width: ".75cm",
	},

	pageNum: {
		position: "absolute",
		fontFamily: "DM Sans",
		bottom: "5mm",
		left: "50%",
		fontSize: "8px",
		transform: "translateX(25%)",
		textAlign: "center",
	},

	headerAfterOne: {
		position: "absolute",
		fontFamily: "DM Sans",
		top: "5mm",
		right: "10mm",
		fontSize: "10px",
	},
});

function BaseLayoutPDF({
	children,

	title,
	orientation,
}: BaseLayoutPDFProps) {
	return (
		<Document>
			<Page size="A4" orientation={orientation} style={styles.page}>
				<View style={styles.logoBox}>
					<Svg
						width="128"
						height="111"
						viewBox="0 0 128 111"
						style={styles.logo}
					>
						<Path
							d="M63.9998 70.1687C62.0788 70.1687 60.2054 69.8089 58.4314 69.0997C58.4204 69.0952 58.4094 69.0907 58.3982 69.0864L9.41297 49.0924C3.69485 46.7962 0.00117493 41.3333 0.00117493 35.1694C0.00117493 29.0055 3.69485 23.5427 9.41297 21.2465L58.3982 1.25239C58.4092 1.24789 58.4202 1.24339 58.4312 1.23914C60.2051 0.529908 62.0786 0.170166 63.9998 0.170166C65.921 0.170166 67.7945 0.529908 69.5684 1.23914C69.5794 1.24364 69.5904 1.24789 69.6014 1.25239L118.587 21.2465C124.305 23.5427 127.998 29.0055 127.998 35.1694C127.998 41.3333 124.305 46.7962 118.587 49.0924L69.6014 69.0864C69.5904 69.0909 69.5794 69.0954 69.5682 69.0997C67.7942 69.8092 65.9208 70.1687 63.9998 70.1687ZM62.1561 59.8196C63.3248 60.2834 64.6748 60.2834 65.8435 59.8196L114.821 39.8286C114.832 39.8241 114.843 39.8198 114.854 39.8156C116.764 39.0513 117.999 37.2276 117.999 35.1697C117.999 33.1117 116.764 31.288 114.854 30.5238C114.843 30.5195 114.832 30.515 114.821 30.5108L65.843 10.5192C64.675 10.0557 63.3248 10.0557 62.1568 10.5192L13.1784 30.5105C13.1676 30.515 13.1569 30.5193 13.1459 30.5235C11.2354 31.2877 10.001 33.1115 10.001 35.1694C10.001 37.2274 11.2354 39.0511 13.1459 39.8153C13.1566 39.8196 13.1674 39.8241 13.1784 39.8283L62.1561 59.8196Z"
							fill="#4794AE"
						/>
						<Path
							d="M63.9998 90.1683C62.0791 90.1683 60.2056 89.8088 58.4317 89.0996C58.4217 89.0956 58.4117 89.0915 58.4019 89.0875L3.11536 66.5728C0.558168 65.5313 -0.671055 62.6139 0.370672 60.0564C1.4124 57.499 4.32959 56.2703 6.88703 57.3115L62.1571 79.8195C63.3256 80.2827 64.6743 80.2827 65.8428 79.8195L121.113 57.3115C123.67 56.27 126.588 57.499 127.629 60.0564C128.671 62.6139 127.442 65.5313 124.884 66.5728L69.5979 89.0875C69.5879 89.0915 69.5779 89.0956 69.5682 89.0996C67.794 89.8088 65.9205 90.1683 63.9998 90.1683Z"
							fill="#4794AE"
						/>
						<Path
							d="M63.9998 110.168C62.0791 110.168 60.2056 109.808 58.4317 109.099C58.4217 109.095 58.4117 109.091 58.4019 109.087L3.11536 86.5723C0.558168 85.5308 -0.671055 82.6134 0.370672 80.0559C1.4124 77.4985 4.32959 76.2695 6.88703 77.311L62.1543 99.8178C63.3243 100.282 64.6758 100.282 65.8458 99.8178L121.113 77.311C123.671 76.2695 126.588 77.4985 127.629 80.0559C128.671 82.6134 127.442 85.5308 124.885 86.5723L69.5979 109.087C69.5882 109.091 69.5782 109.095 69.5682 109.099C67.794 109.808 65.9205 110.168 63.9998 110.168Z"
							fill="#4794AE"
						/>
					</Svg>
					<Text style={styles.logoText}>eleno</Text>
				</View>

				<View style={styles.header}>
					<Text>{title}</Text>
				</View>
				<Text
					style={styles.headerAfterOne}
					render={({ pageNumber }) => (pageNumber > 1 ? title : "")}
					fixed
				/>

				{children}
				<Text
					style={styles.pageNum}
					render={({ pageNumber, totalPages }) =>
						`${pageNumber} / ${totalPages} \n www.eleno.net`
					}
					fixed
				/>
			</Page>
		</Document>
	);
}

export default BaseLayoutPDF;
