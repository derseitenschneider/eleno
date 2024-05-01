import { HiCheck, HiOutlineClipboard, HiOutlineMail } from "react-icons/hi";
import { IoLogoWhatsapp } from "react-icons/io5";
import { MdOutlineTextsms } from "react-icons/md";
import { SiThreema } from "react-icons/si";
import { FaTelegramPlane } from "react-icons/fa";
// import { BsSignal } from 'react-icons/bs'
import { useEffect, useState } from "react";
import { useLessons } from "../../../../services/context/LessonsContext";
import { useStudents } from "../../../../services/context/StudentContext";
import "./shareHomework.style.scss";

import { formatDateToDisplay } from "../../../../utils/formateDate";
import { useUser } from "../../../../services/context/UserContext";

interface ShareHomeworkProps {
	lessonId: number;
}

function ShareHomework({ lessonId }: ShareHomeworkProps) {
	const [isCopied, setIsCopied] = useState(false);
	const { lessons } = useLessons();
	const {
		user: { firstName: userFirstName, lastName: userLastName },
	} = useUser();
	const { students } = useStudents();
	const currentLesson = lessons.find((lesson) => lesson.id === lessonId);
	const { firstName, lastName, instrument } = students.find(
		(student) => student.id === currentLesson.studentId,
	);
	const lessonDate = formatDateToDisplay(currentLesson.date);
	const url = `https://api.eleno.net/homework/${currentLesson.studentId}/${currentLesson.homeworkKey}`;

	const subjectText = `Hausaufgaben ${instrument} vom ${lessonDate}`;
	const bodyText = `Hallo ${firstName}%0D%0A %0D%0AUnter folgendem Link findest du deine Hausaufgaben vom ${lessonDate}: %0D%0A %0D%0A${url} %0D%0A %0D%0ALiebe Grüsse  %0D%0A${userFirstName} ${userLastName}`;

	useEffect(() => {
		if (isCopied) {
			setTimeout(() => {
				setIsCopied(false);
			}, 3000);
		}
	}, [isCopied]);

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(url);
		setIsCopied(true);
	};
	return (
		<div className="share-homework">
			<h1 className="heading-2">Hausaufgaben teilen</h1>
			<p>
				Mit diesem Link kann{" "}
				<b>
					{firstName} {lastName}
				</b>{" "}
				auf die Hausaufgaben vom <b>{lessonDate}</b> zugreifen:
			</p>
			<div className="link">
				<a href={url} target="_blank" rel="noreferrer">
					{url}
				</a>{" "}
				<button type="button" title="Link kopieren" onClick={copyToClipboard}>
					{isCopied ? <HiCheck color="green" /> : <HiOutlineClipboard />}
				</button>
			</div>

			<div className="container-buttons">
				<div className="text">
					<p>Link direkt verschicken:</p>
				</div>
				<div className="buttons">
					<a
						href={`https://t.me/share/url?url=${url}&text=${bodyText}`}
						title="Link per Telegram verschicken"
						target="_blank"
						className="telegram"
						rel="noreferrer"
					>
						<FaTelegramPlane />
					</a>
					<a
						href={`https://threema.id/compose?text=${bodyText}`}
						title="Link per Threema verschicken"
						target="_blank"
						className="threema"
						rel="noreferrer"
					>
						<SiThreema />
					</a>
					{/* <a
          href={`https://signal.me/#p/+447700900123?body=${bodyText}`}
          title="Link per Signal verschicken"
          target="_blank"
          className="signal"
          rel="noreferrer"
        >
          <BsSignal />
        </a> */}
					<a
						href={`https://wa.me/?text=${bodyText}`}
						title="Link per Whatsapp verschicken"
						target="_blank"
						rel="noreferrer"
						className="whatsapp"
					>
						<IoLogoWhatsapp />
					</a>{" "}
					<a
						href={`sms://?&body=${bodyText}`}
						title="Link per SMS verschicken"
						className="sms"
					>
						<MdOutlineTextsms />
					</a>
					<a
						href={`mailto:?subject=${subjectText}&body=${bodyText}`}
						title="Link per E-Mail verschicken"
					>
						<HiOutlineMail />
					</a>
				</div>
			</div>
		</div>
	);
}

export default ShareHomework;
