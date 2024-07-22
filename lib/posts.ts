import type { Locales } from "@/config";
import { allPosts, type Post } from "content-collections";
import { compareDesc } from "date-fns";

const PAGE_SIZE = 5;

export const postsOrderedByDate = (locale: Locales): Post[] =>
  allPosts
    .filter((p) => p.locale === locale && p.isPublished)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

export const homePage = (locale: Locales): Post[] =>
  postsOrderedByDate(locale).slice(0, 3);

export const pages = (locale: Locales) =>
  postsOrderedByDate(locale).reduce((pages, post, i) => {
    const pageIndex = Math.floor(i / PAGE_SIZE);
    if (!pages[pageIndex]) {
      pages[pageIndex] = [];
    }
    pages[pageIndex].push(post);
    return pages;
  }, [] as Post[][]);
