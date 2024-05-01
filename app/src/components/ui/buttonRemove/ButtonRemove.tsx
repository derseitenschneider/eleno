import { IoCloseOutline } from "react-icons/io5";
import "./buttonRemove.style.scss";

interface ButtonRemoveProps {
	onRemove: () => void;
}

function ButtonRemove({ onRemove }: ButtonRemoveProps) {
	return (
		<button className="btn-remove" onClick={onRemove} type="button">
			<IoCloseOutline />
		</button>
	);
}

export default ButtonRemove;
