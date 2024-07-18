import type { IReadTimeResults } from "reading-time";
import { Frontmatter } from "./frontmatter";

export type Information = {
  slug: string;
  readingTime: IReadTimeResults;
} & Frontmatter;
