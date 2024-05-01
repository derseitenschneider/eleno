export default function stripHtmlTags(string: string) {
	const noStyles = /style="[^"]*"/gi;
	const noHrefs = /href="[^"]*"/gi;

	const newString = string
		.replaceAll("<ul>", "")
		.replaceAll("</ul>", "")
		.replaceAll("<li>", "• ")
		.replaceAll("</li>", "\n")
		.replaceAll("<div>", "\n")
		.replaceAll("</div>", "")
		.replaceAll("-&gt;", "➔ ")
		.replaceAll("<br>", "\n")
		.replace("</br>", "")
		.replace(noStyles, "")
		.replace(noHrefs, "")
		.replaceAll("<span>", "")
		.replaceAll("<span >", "")
		.replaceAll("</span>", "")
		.replaceAll("&nbsp;", "")
		.replaceAll("<ol>", "")
		.replaceAll("</ol>", "")
		.replaceAll("<b>", "")
		.replaceAll("</b>", "")
		.replaceAll("<i>", "")
		.replaceAll("</i>", "")
		.replaceAll("<u>", "")
		.replaceAll("</u>", "")
		.replaceAll("<a>", "")
		.replaceAll("<a >", "")
		.replaceAll("</a>", "")
		.replaceAll("&amp;", "&");

	return newString;
}
