import type { Locales } from "@/config";
import { ImageResponse } from "@vercel/og";
import clsx from "clsx";
import type { Post } from "content-collections";
import { getTranslations } from "next-intl/server";
import allPosts from ".generated/Post/withoutbody.json";

type Props = {
	params: {
		slug: string;
		locale: Locales;
	};
};

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params: { slug, locale } }: Props) {
	// @ts-ignore i don't know how to fix typing here
	const post: Post = allPosts.find(
		(p) => p.slug === slug && p.locale === locale,
	);
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
	const t = await getTranslations("blog");

	const workSansBold = await fetch(
		new URL("../../../../content/fonts/work-sans-bold.ttf", import.meta.url),
	).then((res) => res.arrayBuffer());

	const workSansSemiBold = await fetch(
		new URL(
			"../../../../content/fonts/work-sans-semi-bold.ttf",
			import.meta.url,
		),
	).then((res) => res.arrayBuffer());

	const workSansMedium = await fetch(
		new URL("../../../../content/fonts/work-sans.ttf", import.meta.url),
	).then((res) => res.arrayBuffer());

	return new ImageResponse(
		<div
			tw="w-full h-full p-4 flex"
			style={{
				backgroundImage: "linear-gradient(to right, #0891B2, #164E63)",
				fontFamily: '"WorkSans"',
			}}
		>
			<div tw="rounded-xl border-2 border-neutral-700 w-full h-full p-4 flex bg-neutral-800 shadow-lg">
				<div tw="flex flex-col px-6 space-y-4 w-full h-full justify-between">
					<div tw="flex flex-col">
						<span
							tw={clsx("font-bold text-white text-7xl mb-8", {
								"text-7xl": post.title.length < 40,
								"text-6xl": post.title.length >= 40,
							})}
							style={{
								fontFamily: '"WorkSans"',
							}}
						>
							{post.title}
						</span>
						<p tw="text-5xl line-clamp-2 text-neutral-300">{post.summary}</p>
					</div>
					<div tw="flex flex-row items-center">
						<img
							tw="rounded-full border-2 border-neutral-700"
							width="110"
							height="110"
							alt="author"
							src="https://avatars.githubusercontent.com/u/15827589"
						/>
						<div tw="flex flex-row">
							<div
								style={{
									fontFamily: '"WorkSans"',
								}}
								tw="ml-6 text-4xl flex flex-col leading-none font-semibold text-neutral-400"
							>
								Jesus Santander
								<div tw="ml-1 flex flex-row">
									<span tw="font-semibold text-neutral-100">jsantanders</span>
									<span tw=" font-semibold text-orange-400">.dev</span>
								</div>
							</div>
						</div>
					</div>
					<div tw="flex justify-between items-end w-full text-neutral-400 text-4xl">
						<span>
							{t("read")}: {post.readingTime}
						</span>
						<span>{post.date}</span>
					</div>
				</div>
			</div>
		</div>,
		{
			...size,
			debug: false,
			fonts: [
				{
					name: "WorkSans",
					data: await workSansBold,
					style: "normal",
					weight: 700,
				},
				{
					name: "WorkSans",
					data: await workSansSemiBold,
					style: "normal",
					weight: 600,
				},
				{
					name: "WorkSans",
					data: await workSansMedium,
					style: "normal",
					weight: 400,
				},
			],
		},
	);
}
