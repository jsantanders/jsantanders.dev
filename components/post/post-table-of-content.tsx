"use client";

import { Link } from "@/navigation";
import type { Toc, TocEntry } from "@stefanprobst/rehype-extract-toc";
import { useCallback, useEffect, useState } from "react";

type PostTableOfContentProps = {
	toc: Toc;
	locales: {
		title: string;
	};
};

//TODO: I don't want to include the footnotes section,
// but still want to generate it. It could be a better way of handle this.
const NON_TOC_ELEMENTS = ["Footnotes"];

export const PostTableOfContents: React.FC<PostTableOfContentProps> = ({
	toc,
	locales,
}) => {
	const [activeSection, setActiveSection] = useState(toc[0]?.id);
	const concatTocIds = useCallback((toc: Toc) => {
		const result: string[] = [];

		function traverse(entry: Toc[0]) {
			if (entry.id) {
				result.push(entry.id);
			}

			if (entry.children) {
				entry.children.forEach(traverse);
			}
		}

		toc.forEach(traverse);

		return result;
	}, []);

	useEffect(() => {
		const observers = concatTocIds(toc).map((id) => {
			const element = document.getElementById(id);
			if (!element) return null;

			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry?.isIntersecting) {
						setActiveSection(id);
					}
				},
				{
					rootMargin: "44px 0% -35% 0px",
				},
			);

			observer.observe(element);
			return observer;
		});

		return () => {
			// biome-ignore lint/complexity/noForEach: <explanation>
			observers.forEach((observer) => observer?.disconnect());
		};
	}, [toc, concatTocIds]);

	if (!toc?.length) {
		return null;
	}

	return (
		<nav>
			<h5 className="md:translate-y-h5 mb-4 translate-y-1 font-bold uppercase">
				{locales.title}
			</h5>
			<ListOfContent
				nodes={toc}
				activeSection={activeSection}
				setActiveSectionId={setActiveSection}
			/>
		</nav>
	);
};

const ListOfContent: React.FC<{
	nodes: Toc;
	chapter?: string;
	activeSection?: string;
	setActiveSectionId: React.Dispatch<React.SetStateAction<string | undefined>>;
}> = ({ nodes, activeSection, setActiveSectionId, chapter = "" }) => {
	return (
		<ul>
			{nodes
				.filter((n) => !NON_TOC_ELEMENTS.includes(n.value))
				.map((node, idx) => (
					<li key={node.id}>
						<TOCLink
							node={node}
							ch={`${chapter}${idx + 1}.`}
							isHighlighted={activeSection === node.id}
							onNavigate={setActiveSectionId}
						/>
						{node.children?.length && node.children?.length > 0 && (
							<ListOfContent
								activeSection={activeSection}
								setActiveSectionId={setActiveSectionId}
								nodes={node.children}
								chapter={`${chapter}${idx + 1}.`}
							/>
						)}
					</li>
				))}
		</ul>
	);
};

const TOCLink: React.FC<{
	node: TocEntry;
	ch: string;
	isHighlighted: boolean;
	onNavigate: (entry: string) => void;
}> = ({ node, ch, isHighlighted, onNavigate }) => {
	const fontSizes: Record<number, string> = { 2: "sm", 3: "sm", 4: "xs" };
	const padding: Record<number, string> = { 2: "pl-0", 3: "pl-7", 4: "pl-10" };
	const id = node.id;

	if (!id) return null;

	return (
		<Link
			href={`#${id}`}
			className={`block text-${fontSizes[node.depth]} ${
				padding[node.depth]
			} border-l py-1 pl-3 hover:border-primary hover:text-primary ${
				isHighlighted
					? "border-primary text-primary"
					: "border-muted text-muted-foreground"
			}`}
			onClick={(e) => {
				e.preventDefault();
				onNavigate(id);
				document
					.getElementById(id)
					?.scrollIntoView({ behavior: "smooth", block: "start" });
			}}
		>
			{ch} {node.value}
		</Link>
	);
};
