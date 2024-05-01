import "./deleteAccount.style.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../../services/context/UserContext";
import fetchErrorToast from "../../../../../hooks/fetchErrorToast";
import Button from "../../../../ui/button/Button.component";

interface DeleteAccountProps {
	onCloseModal?: () => void;
}

function DeleteAccount({ onCloseModal }: DeleteAccountProps) {
	const { user, deleteAccount } = useUser();
	const [input, setInput] = useState("");
	const [check, setCheck] = useState(input === user.email);
	const navigate = useNavigate();

	const inputHandler = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setInput(e.target.value);
		setCheck(e.target.value === user.email);
	};

	const handleDelete = async () => {
		try {
			await deleteAccount();
			navigate("/");
		} catch (error) {
			fetchErrorToast();
		}
	};

	return (
		<div className="delete-account">
			<h2 className="heading-2">Benutzerkonto löschen</h2>
			<div className="delete-account__input">
				<label htmlFor="email">
					Email-Adresse zur Bestätigung
					<input
						autoFocus
						type="text"
						name="email"
						className={`email${!check ? " input--error" : ""}`}
						value={input}
						onChange={inputHandler}
					/>
				</label>
			</div>
			<div className="delete-account__buttons">
				<Button type="button" btnStyle="secondary" onClick={onCloseModal}>
					Abbrechen
				</Button>
				<Button
					type="button"
					btnStyle="danger"
					onClick={handleDelete}
					disabled={!check}
				>
					Benutzerkonto löschen
				</Button>
			</div>
		</div>
	);
}

export default DeleteAccount;
