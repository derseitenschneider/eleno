import { useEffect } from "react";

export default function useScrollTo({ x, y }: { x: number; y: number }): void {
	useEffect(() => {
		window.scrollTo(x, y);
	}, []);
}
