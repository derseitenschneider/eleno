import React from "react";
import { HiSelector } from "react-icons/hi";
import Menus from "../menu/Menus.component";

interface SelectProps {
	disabled?: boolean;
	label: string;
	options: {
		name: string;
		icon: React.ReactElement;
		iconColor?: string;
		breakBefore?: boolean;
	}[];
	selected: string;
	setSelected: React.Dispatch<React.SetStateAction<string>>;
}

function Select({
	disabled = false,
	label,
	options,
	selected,
	setSelected,
}: SelectProps) {
	return (
		<Menus icon={<HiSelector />}>
			<Menus.Toggle id="action" label={selected || label} disabled={disabled} />

			<Menus.Menu>
				<Menus.List id="action">
					{options.map((option) => (
						<React.Fragment key={option.name}>
							{option.breakBefore && <hr />}
							<Menus.Button
								icon={option.icon}
								iconColor={option.iconColor}
								onClick={() => setSelected(option.name)}
							>
								{option.name}
							</Menus.Button>
						</React.Fragment>
					))}
				</Menus.List>
			</Menus.Menu>
		</Menus>
	);
}

export default Select;
