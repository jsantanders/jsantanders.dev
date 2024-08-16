import { baseUrl } from "@/config";
import { NextResponse } from "next/server";

export const GET = async () => {
	return NextResponse.json({
		name: "jsantanders.dev",
		short_name: "jsantanders.dev",
		icons: [
			{
				src: "/icon2.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icon3.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
		theme_color: "#FB923C",
		background_color: "#292524",
		display: "standalone",
		start_url: baseUrl,
	});
};
