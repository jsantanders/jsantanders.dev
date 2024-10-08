import { baseUrl } from "@/config";
import { pages, postsOrderedByDate } from "lib/posts";
import type { MetadataRoute } from "next";

type SitemapEntry = {
	url: string;
	lastModified?: string | Date;
};

const createUrl = (p: string) => baseUrl + p;

const rootEntry: SitemapEntry = {
	url: baseUrl,
	lastModified: new Date(),
};

const createPostEntries = (): SitemapEntry[] =>
	postsOrderedByDate("en").map((p) => {
		const url: SitemapEntry = {
			url: createUrl(p.url),
		};
		if (p.lastModification) {
			url.lastModified = p.lastModification;
		}
		return url;
	});

const createPostPagesEntries = (): SitemapEntry[] =>
	pages("en").map((_, i) => ({
		url: createUrl(`/posts/pages/${i + 1}`),
		lastModified: new Date(),
	}));

export default function sitemap(): MetadataRoute.Sitemap {
	return [rootEntry, ...createPostPagesEntries(), ...createPostEntries()];
}
