import searchOptions from "lib/search";
import MiniSearch from "minisearch";
import { NextResponse } from "next/server";
import searchIndex from ".generated/Post/search-index.json";

export const runtime = "edge";

//@ts-ignore: don't know how to make types work here.
const miniSearch = MiniSearch.loadJS(searchIndex, searchOptions);

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	const query = searchParams.get("q");
	if (!query) {
		return new Response("Missing query parameter", {
			status: 400,
		});
	}

	const result = miniSearch.search(query, {
		prefix: true,
	});

	result.splice(5);

	return NextResponse.json(result);
}
