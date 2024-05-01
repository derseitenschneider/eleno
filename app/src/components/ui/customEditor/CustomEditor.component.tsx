import "./customEditor.style.scss";

import {
	BtnBold,
	BtnBulletList,
	BtnClearFormatting,
	BtnItalic,
	BtnLink,
	BtnNumberedList,
	BtnRedo,
	BtnStrikeThrough,
	BtnUnderline,
	BtnUndo,
	type ContentEditableEvent,
	Editor,
	EditorProvider,
	Toolbar,
} from "react-simple-wysiwyg";

interface CustomEditorProps {
	value: string;
	onChange: (content: string) => void;
}

function CustomEditor({ value, onChange }: CustomEditorProps) {
	const onChangeEditor = (e: ContentEditableEvent) => {
		const inputText = e.target.value;
		const inputWithoutColorTag = inputText.split("background-color:").join("");

		onChange(inputWithoutColorTag);
	};
	return (
		<EditorProvider>
			<Editor value={value} onChange={onChangeEditor}>
				<Toolbar>
					<div className="container--left">
						<BtnBold tabIndex={-1} />
						<BtnItalic tabIndex={-1} />
						<BtnUnderline tabIndex={-1} />
						<BtnStrikeThrough tabIndex={-1} />
						<BtnBulletList tabIndex={-1} />
						<BtnNumberedList tabIndex={-1} />
						<BtnLink tabIndex={-1} />
					</div>
					<div className="container--right">
						<BtnClearFormatting tabIndex={-1} />
						<BtnUndo tabIndex={-1} />
						<BtnRedo tabIndex={-1} />
					</div>
				</Toolbar>
			</Editor>
		</EditorProvider>
	);
}

export default CustomEditor;
