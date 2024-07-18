"use client";

import { useEffect, useState } from "react";
import { Toc, TocEntry } from "@stefanprobst/rehype-extract-toc";
import { useHighlighted } from "@/hooks/use-highlighted";
import { generateId } from "@/lib/generate-id";
import { Link } from "@/navigation";
import { createPortal } from "react-dom";

type PostTableOfContentProps = {
  toc: Toc;
  locales: {
    title: string;
  };
};

export const PostTableOfContents: React.FC<PostTableOfContentProps> = ({ toc, locales }) => {
  if (!toc?.length) {
    return null;
  }

  return (
    <nav>
      <h5 className="md:translate-y-h5 mb-4 translate-y-1 text-base font-bold uppercase">
        {locales.title}
      </h5>
      {renderNodes(toc)}
    </nav>
  );
};

function renderNodes(nodes: Toc, chapter = "") {
  return (
    <ul>
      {nodes.map((node, idx) => (
        <li key={node.id}>
          <TOCLink node={node} ch={`${chapter}${idx + 1}.`} />
          {node.children?.length &&
            node.children?.length > 0 &&
            renderNodes(node.children, `${chapter}${idx + 1}.`)}
        </li>
      ))}
    </ul>
  );
}

const TOCLink: React.FC<{ node: TocEntry; ch: string }> = ({ node, ch }) => {
  const fontSizes: Record<number, string> = { 2: "base", 3: "sm", 4: "xs" };
  const padding: Record<number, string> = { 2: "pl-0", 3: "pl-7", 4: "pl-10" };
  const id = node.id || generateId(6);
  const [highlighted, setHighlighted] = useHighlighted(id);
  return (
    <Link
      href={`#${id}`}
      className={`block text-${fontSizes[node.depth]} ${
        padding[node.depth]
      } border-l py-1 pl-3 hover:border-primary hover:text-primary ${
        highlighted ? "border-primary text-primary" : "border-muted text-muted-foreground"
      }`}
      onClick={(e) => {
        e.preventDefault();
        setHighlighted(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {ch} {node.value}
    </Link>
  );
};
