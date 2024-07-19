import { Locales } from "@/config";
import { allPosts } from "content-collections";
import { compareDesc } from "date-fns";

const PAGE_SIZE = 5;

export const postsOrderedByDate = (locale: Locales) =>
  allPosts
    .filter((p) => p)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

export const homePage = postsOrderedByDate.slice(0, 5);

export const pages = postsOrderedByDate.reduce(
  (pages, post, i) => {
    const pageIndex = Math.floor(i / PAGE_SIZE);
    if (!pages[pageIndex]) {
      pages[pageIndex] = [];
    }
    pages[pageIndex].push(post);
    return pages;
  },
  [] as (typeof postsOrderedByDate)[],
);

const getSlugAndDateFromDir = (dir: string) => {
  const isDate = (dt: string) => String(new Date(dt)) !== "Invalid Date";

  const dateAndSlug = dir.split("--");
  if (dateAndSlug.length < 2) {
    throw Error(
      `invalid post folder format ${dir}. it should be yyyy-mm-dd--title-of-the-post`,
    );
  }
  if (dateAndSlug[0] === undefined || !isDate(dateAndSlug[0])) {
    throw Error("invalid date. it should be yyyy-mm-dd");
  }
  if (dateAndSlug[1] === undefined) {
    throw Error("invalid or empty post title");
  }
  return { date: dateAndSlug[0], slug: dateAndSlug[1] };
};
