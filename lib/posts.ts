import type { Locales } from "@/config";
import { Tag } from "@/types";
import { type Post, allPosts } from "content-collections";
import { compareDesc } from "date-fns";
import { slugify } from "./utils";

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

export const allTags = (locale: Locales) =>
	allPosts
		.filter((p) => p.locale === locale)
		.reduce<Record<string, number>>((acc, current) => {
			for (const tag of current.tags) {
				const slug = slugify(tag);
				if (acc[slug]) acc[slug] += 1;
				else acc[slug] = 1;
			}
			return acc;
		}, {});

export const postsFilteredByTag = (locale: Locales, tag: string): Post[] =>
	allPosts
		.filter((p) => p.locale === locale && p.isPublished && p.tags.includes(tag))
		.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

export const tagPages = (locale: Locales, tag: string) =>
	postsFilteredByTag(locale, tag).reduce((pages, post, i) => {
		const pageIndex = Math.floor(i / PAGE_SIZE);
		if (!pages[pageIndex]) {
			pages[pageIndex] = [];
		}
		pages[pageIndex].push(post);
		return pages;
	}, [] as Post[][]);
