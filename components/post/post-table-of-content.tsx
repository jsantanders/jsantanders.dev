"use client";

import { Link } from "@/navigation";
import type { Toc, TocEntry } from "@stefanprobst/rehype-extract-toc";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";

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
	const [isOpen, setIsOpen] = useState(false);

	if (!toc?.length && toc.length > 0) {
		return null;
	}

	return (
		<div className="w-full border rounded-lg bg-primary-foreground p-4 my-8">
			<Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
				<div className="flex items-center justify-between">
					<h2 className="text-xl lg:text-2xl font-semibold">{locales.title}</h2>
					<CollapsibleTrigger asChild>
						<Button variant="ghost" size="sm" className="w-9 p-0">
							{isOpen ? (
								<ChevronUp className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)}
							<span className="sr-only">Toggle table of contents</span>
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent className="mt-4">
					<nav>
						<ListOfContent nodes={toc} />
					</nav>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};

const ListOfContent: React.FC<{
	nodes: Toc;
	chapter?: string;
}> = ({ nodes, chapter = "" }) => {
	const headingElements = nodes
		.filter((n) => !NON_TOC_ELEMENTS.includes(n.value))
		.map((node, idx) => {
			return (
				<li key={node.id}>
					<TOCLink node={node} ch={`${chapter}${idx + 1}.`} />

					{node.children?.length && node.children?.length > 0 && (
						<ListOfContent
							nodes={node.children}
							chapter={`${chapter}${idx + 1}.`}
						/>
					)}
				</li>
			);
		});

	return <ul>{headingElements}</ul>;
};

const TOCLink: React.FC<{
	node: TocEntry;
	ch: string;
}> = ({ node, ch }) => {
	const fontSizes: Record<number, string> = { 2: "base", 3: "sm", 4: "xs" };
	const padding: Record<number, string> = { 2: "pl-0", 3: "pl-7", 4: "pl-10" };
	const id = node.id;

	if (!id) return null;

	return (
		<Link
			href={`#${id}`}
			className={`block text-${fontSizes[node.depth]} ${padding[node.depth]} py-1 text-muted-foreground hover:text-primary hover:underline
      }`}
			onClick={(e) => {
				e.preventDefault();
				document
					.getElementById(id)
					?.scrollIntoView({ behavior: "smooth", block: "start" });
			}}
		>
			{ch} {node.value}
		</Link>
	);
};
