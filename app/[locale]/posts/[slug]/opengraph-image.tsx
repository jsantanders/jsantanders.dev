import { ImageResponse } from "@vercel/og";
import clsx from "clsx";
import type { Post } from "content-collections";
import allPosts from ".generated/Post/withoutbody.json";

type Params = {
	slug: string;
};

type Props = {
	params: Params;
};

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: Props) {
	const slug = params.slug;
	// @ts-ignore i don't know how to fix typing here
	const post: Post = allPosts.find((p) => slug === p._meta.path);
	if (!post) {
		return new Response(
			JSON.stringify({
				message: `Could not find post with slug: ${slug}`,
			}),
			{
				status: 404,
			},
		);
	}

	const WorkSans = fetch(
		new URL("content/fonts/work-sans.woff2", import.meta.url),
	).then((res) => res.arrayBuffer());

	return new ImageResponse(
		<div
			tw="w-full h-full p-4 flex"
			style={{
				backgroundImage: "linear-gradient(to right, #0891B2, #164E63)",
				fontFamily: '"WorkSans"',
			}}
		>
			<div tw="rounded-xl border-2 border-stone-700 w-full h-full p-4 flex bg-stone-800 shadow-lg">
				<div tw="flex flex-col px-6 w-[740px] h-full justify-between">
					<div tw="flex flex-col">
						<span
							tw={clsx("font-bold text-stone-50 mb-6", {
								"text-7xl": post.title.length < 40,
								"text-6xl": post.title.length >= 40,
							})}
							style={{
								fontFamily: '"WorkSans"',
							}}
						>
							{post.title}
						</span>
						<span tw="text-5xl text-stone-300">{post.summary}</span>
					</div>
					<div tw="flex justify-between items-end w-full text-stone-400 text-xl">
						<span>{post.readingTime}</span>
						<div
							tw="flex text-4xl font-bold"
							style={{
								fontFamily: '"WorkSans"',
							}}
						>
							<span tw="text-stone-50">jsantanders</span>
							<span tw="text-orange-400">.dev</span>
						</div>
						<span>{post.date.substring(0, post.date.indexOf("T"))}</span>
					</div>
				</div>
				<div
					tw="w-32 h-32 border-t-2 border-t-stone-700 border-l-2 border-l-stone-700 bg-stone-800 rounded-full absolute left-[324px] bottom-[59px]"
					style={{
						transform: "rotate(-45deg)",
					}}
				/>
				<div tw="absolute left-[338px] bottom-[68px] flex items-center">
					<img
						tw="rounded-full border-2 border-stone-700"
						width="110"
						height="110"
						alt="author"
						src="https://avatars.githubusercontent.com/u/15827589"
					/>
					<p tw="ml-6 text-4xl font-semibold text-stone-400">Jesus Santander</p>
				</div>
			</div>
		</div>,
		{
			...size,
			debug: false,
			fonts: [
				{
					name: "WorkSans",
					data: await WorkSans,
					style: "normal",
					weight: 700,
				},
				{
					name: "WorkSans",
					data: await WorkSans,
					style: "normal",
					weight: 400,
				},
				{
					name: "WorkSans",
					data: await WorkSans,
					style: "normal",
					weight: 600,
				},
			],
		},
	);
}
