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
    <nav className={"toc"}>
      <h5 className="mb-6 mt-8 translate-y-1 text-xl font-bold md:translate-y-h5">
        {i18n.t("blog.toc.title")}
      </h5>
      {renderNodes(toc)}
    </nav>
  );
};

/**
 * Renders the nodes recursively.
 * @param {Array} nodes - The nodes to render.
 * @returns {JSX.Element} - The rendered nodes.
 */
function renderNodes(nodes: Toc) {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          <TOCLink node={node} />
          {node.children?.length && node.children?.length > 0 && renderNodes(node.children)}
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
const TOCLink: React.FC<{ node: TocEntry }> = ({ node }) => {
  const fontSizes: Record<number, string> = { 2: "sm", 3: "xs", 4: "xs" };
  const padding: Record<number, string> = { 2: "pl-0", 3: "pl-2", 4: "pl-4" };
  const id = node.id || generateId(6);
  const [highlighted, setHighlighted] = useHighlighted(id);
  return (
    <NextLink
      href={`#${id}`}
      className={`block text-${fontSizes[node.depth]} ${
        padding[node.depth]
      } py-1 hover:text-blue-600 dark:hover:text-blue-400 ${
        highlighted && "text-blue-600 dark:text-blue-400"
      }`}
      onClick={(e) => {
        e.preventDefault();
        setHighlighted(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {node.value}
    </NextLink>
  );
};
