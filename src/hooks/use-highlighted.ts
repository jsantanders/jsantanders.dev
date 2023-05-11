import { useEffect, useRef, useState } from "react";

/**
 * Hook to highlight the current section in the toc
 * @param {string} id - Id of the section
 * @returns {[boolean, React.Dispatch<React.SetStateAction<string>>]} Whether the section is highlighted and a function to set the active section
 */
export function useHighlighted(
  id: string
): [boolean, React.Dispatch<React.SetStateAction<string>>] {
  const observer = useRef<IntersectionObserver | null>(null);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // eslint-disable-next-line require-jsdoc
    const handleObserver: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "0% 0% -35% 0px",
    });

    const elements = document.querySelectorAll("h2, h3, h4");
    elements.forEach((elem) => observer.current?.observe(elem));
    return () => observer.current?.disconnect();
  }, []);

  return [activeId === id, setActiveId];
}
