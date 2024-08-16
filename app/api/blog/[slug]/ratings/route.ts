import { prisma } from "@/lib/prisma";

export async function POST(
	request: Request,
	{ params }: { params: { slug: string } },
) {
	const { userId, rate } = await request.json();
	const slug = params.slug;

	if (!userId || !rate) return Response.json({}, { status: 400 });

	await prisma.ratings.create({
		data: {
			userId,
			slug,
			rate,
		},
	});

	return Response.json({}, { status: 200 });
}
