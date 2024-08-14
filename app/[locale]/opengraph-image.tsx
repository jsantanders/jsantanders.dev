import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "@vercel/og";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
	const t = await getTranslations("home");

	const workSansBold = fs.promises.readFile(
		path.join(
			fileURLToPath(import.meta.url),
			"../../content/fonts/work-sans-bold.ttf",
		),
	);

	const workSansSemiBold = fs.promises.readFile(
		path.join(
			fileURLToPath(import.meta.url),
			"../../content/fonts/work-sans-semi-bold.ttf",
		),
	);
	const workSansMedium = fs.promises.readFile(
		path.join(
			fileURLToPath(import.meta.url),
			"../../content/fonts/work-sans.ttf",
		),
	);

	return new ImageResponse(
		<div
			tw="w-full h-full p-4 flex justify-center items-center relative"
			style={{
				background:
					"radial-gradient(circle, rgba(82,82,91,1) 0%, rgba(24,24,27,1) 75%, rgba(24,24,27,1) 100%)",
			}}
		>
			<div tw="flex flex-col justify-center items-center">
				<div
					tw="flex text-[10rem] font-bold"
					style={{
						fontFamily: '"WorkSans"',
					}}
				>
					<span tw="text-stone-50">{t("seo.title")}</span>
				</div>
			</div>
			<div tw="absolute bottom-8 flex flex-col items-center justify-center">
				<p tw="text-xl text-stone-200">{t("seo.description")}</p>
				<div tw="flex items-center justify-center w-full">
					<img
						alt="avatar"
						tw="rounded-full border-2 border-stone-700"
						width="72"
						height="72"
						src="https://avatars.githubusercontent.com/u/493333"
					/>
					<p tw="ml-4 text-4xl font-semibold text-stone-200 text-center">
						Jesus Santander
					</p>
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
					name: "workSans",
					data: await workSansMedium,
					style: "normal",
					weight: 400,
				},
				{
					name: "workSans",
					data: await workSansSemiBold,
					style: "normal",
					weight: 600,
				},
			],
		},
	);
}
