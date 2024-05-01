import "./empty.style.scss";

interface EmtpyProps {
	emptyMessage: string;
}

function Emtpy({ emptyMessage }: EmtpyProps) {
	return (
		<div className="empty">
			<h3 className="heading-3">{emptyMessage}</h3>
		</div>
	);
}

export default Emtpy;
