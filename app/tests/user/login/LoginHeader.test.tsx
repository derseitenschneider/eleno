import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {}

import React from "react";
describe("Greet", () => {
	it("should render the logo", () => {
		render(<LoginHeader preText="Test" buttonText="Test" onClick={() => {}} />);

		screen.debug();
		const link = screen.getByRole("link");
		const svg = screen.getByTestId("logo-eleno");
		expect(link).toHaveTextContent("eleno");
		expect(svg).toBeInTheDocument();
	});
});
