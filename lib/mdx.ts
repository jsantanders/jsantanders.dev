import type { Toc } from "@stefanprobst/rehype-extract-toc";
import { getMDXExport } from "mdx-bundler/client";

export const getTableOfContents = (code: string): Toc => {
	const mdxExport = getMDXExport(code);
	return mdxExport.tableOfContents;
};
