import "./noContent.style.scss";

import type React from "react";
import type { ReactElement } from "react";
import type { IconType } from "react-icons/lib";
import Button from "../button/Button.component";

interface NoContentProps {
	heading: string;
	buttons?: {
		label: string;
		handler: () => void;
		icon?: ReactElement<IconType>;
	}[];
	children?: React.ReactNode;
}

function NoContent({ heading, buttons, children }: NoContentProps) {
	return (
		<div className="no-content">
			<div className="content">
				<h3 className="heading-3">{heading}</h3>
				{children}
				<div className="container--buttons">
					{buttons?.map(({ label, handler, icon }) => (
						<Button
							type="button"
							btnStyle="primary"
							label={label}
							handler={handler}
							icon={icon}
							key={label}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default NoContent;
