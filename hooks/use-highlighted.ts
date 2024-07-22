"use client";

import { useEffect, useRef, useState } from "react";

export function useHighlighted(
	id: string,
): [boolean, React.Dispatch<React.SetStateAction<string>>] {
	const observer = useRef<IntersectionObserver | null>(null);
	const [activeId, setActiveId] = useState("");

	useEffect(() => {
		const handleObserver: IntersectionObserverCallback = (entries) => {
			for (const entry of entries) {
				if (entry?.isIntersecting) {
					setActiveId(entry.target.id);
				}
			}
		};

		observer.current = new IntersectionObserver(handleObserver, {
			rootMargin: "0% 0% -35% 0px",
		});

		const elements = document.querySelectorAll("h2, h3, h4");
		for (const elem of elements) {
			observer.current?.observe(elem);
		}
		return () => observer.current?.disconnect();
	}, []);

	return [activeId === id, setActiveId];
}
