import type { DependencyList } from "react";
import { useEffect, useState } from "react";

type ScrollPosition = {
	scrollX: number;
	scrollY: number;
};

const isRenderingOnServer = typeof window === "undefined";

const getScrollPosition = (): ScrollPosition => ({
	scrollX: isRenderingOnServer ? 0 : window.scrollX,
	scrollY: isRenderingOnServer ? 0 : window.scrollY,
});

export const useScrollPosition = (
	callback?: (position: ScrollPosition) => void,
	deps: DependencyList = [],
): ScrollPosition => {
	const [scrollPosition, setScrollPosition] = useState(getScrollPosition);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollPosition = getScrollPosition();

			setScrollPosition(currentScrollPosition);

			if (callback) {
				callback(currentScrollPosition);
			}
		};

		const opts: AddEventListenerOptions & EventListenerOptions = {
			passive: true,
		};

		window.addEventListener("scroll", handleScroll, opts);

		return () => window.removeEventListener("scroll", handleScroll, opts);
	}, [deps]);

	return scrollPosition;
};
