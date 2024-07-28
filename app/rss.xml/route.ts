import { baseUrl } from "@/config";
import { type Post, allPosts } from "content-collections";
import { compareDesc, parseISO, setHours } from "date-fns";
import { Feed } from "feed";

const createPostUrl = (url: string) => {
	return `${url}?utm_campaign=feed&utm_source=rss2`;
};

const createContent = (post: Post, url: string) => `
<p>${post.summary}</p>
<p>Read the full article on <a href="${url}">jsantanders.dev</a></p>`;

const me = {
	name: "Jesus Santander",
	email: "jsantanders@outlook.com",
	link: baseUrl,
};

const createFeed = () => {
	const feed = new Feed({
		title: "jsantanders.dev",
		description: "Personal website and blog by Jesus Santander",
		id: baseUrl,
		link: baseUrl,
		language: "en",
		favicon: `${baseUrl}/favicon.ico`,
		copyright: `All rights reserved ${new Date().getFullYear()}, Jesus Santander`,
		author: me,
	});

	// biome-ignore lint/complexity/noForEach: <explanation>
	allPosts
		.filter((p) => p.locale === "en")
		.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
		.forEach((post) => {
			const id = `${baseUrl}${post.url}`;
			const url = createPostUrl(id);
			feed.addItem({
				title: post.title,
				id: id,
				link: url,
				description: post.summary,
				content: createContent(post, url),
				author: [me],
				date: setHours(parseISO(post.date), 13),
				category: post.tags.map((name) => ({ name })),
			});
		});

	return feed.rss2();
};

export const GET = async () => {
	const feed = createFeed();
	return new Response(feed, {
		status: 200,
		headers: {
			"Content-Type": "application/xml",
		},
	});
};
