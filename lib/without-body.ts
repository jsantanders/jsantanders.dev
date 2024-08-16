import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Post } from "content-collections";

export default async function withoutBody(posts: Post[], outputPath: string) {
	const postsWithoutContent = posts.map((post) => {
		return {
			...post,
			content: undefined,
		};
	});
	const directory = join(outputPath, "Post");
	await mkdir(directory, { recursive: true });
	await writeFile(
		join(directory, "withoutbody.json"),
		JSON.stringify(postsWithoutContent, null, 2),
		{
			encoding: "utf-8",
		},
	);
}
