import { useEffect } from "react";

export function useMountEffect(fn: () => void) {
	useEffect(fn, []);
}
