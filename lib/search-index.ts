import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Post } from "content-collections";
import MiniSearch from "minisearch";
import searchOptions from "./search";

export default async function searchIndex(posts: Post[], outputPath: string) {
	if (posts.length === 0) {
		return;
	}

	const miniSearch = new MiniSearch(searchOptions);
	// Index all documents
	miniSearch.addAll(
		posts.map((post) => ({ ...post, content: post.content.raw })),
	);

	const data = miniSearch.toJSON();

	const directory = join(outputPath, "Post");
	await mkdir(directory, { recursive: true });
	await writeFile(join(directory, "search-index.json"), JSON.stringify(data), {
		encoding: "utf-8",
	});
}
