/* eslint-disable @typescript-eslint/no-explicit-any */
import NextLink from "next/link";

import { Toc, TocEntry } from "@stefanprobst/rehype-extract-toc";
import { useI18n } from "next-localization";

import { useHighlighted } from "@/hooks/use-highlighted";
import { generateId } from "@/lib/generate-id";

/**
 * A component that renders a table of contents for a post.
 * @param {Array} nodes - The nodes to render.
 * @returns {JSX.Element} - The rendered component.
 */
export const TableOfContents: React.FC<{ toc: Toc }> = ({ toc }) => {
  const i18n = useI18n();

  if (!toc?.length) {
    return null;
  }

  return (
    <nav>
      <h5 className="mb-4 mt-8 translate-y-1 text-2sm font-bold uppercase md:translate-y-h5">
        {i18n.t("blog.toc.title")}
      </h5>
      {renderNodes(toc)}
    </nav>
  );
};

/**
 * Renders the nodes recursively.
 * @param {Array} nodes - The nodes to render.
 * @param {string} chapter - The chapter.
 * @returns {JSX.Element} - The rendered nodes.
 */
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

/**
 * Table of contents link component.
 * @param {Object} node - The node to render.
 * @returns {JSX.Element} - The rendered component.
 */
const TOCLink: React.FC<{ node: TocEntry; ch: string }> = ({ node, ch }) => {
  const fontSizes: Record<number, string> = { 2: "2sm", 3: "sm", 4: "xs" };
  const padding: Record<number, string> = { 2: "pl-0", 3: "pl-7", 4: "pl-10" };
  const id = node.id || generateId(6);
  const [highlighted, setHighlighted] = useHighlighted(id);
  return (
    <NextLink
      href={`#${id}`}
      className={`block text-${fontSizes[node.depth]} ${
        padding[node.depth]
      } border-l border-primary py-1 pl-3 hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 ${
        highlighted && "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
      }`}
      onClick={(e) => {
        e.preventDefault();
        setHighlighted(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {ch} {node.value}
    </NextLink>
  );
};
