import { prisma } from "@/lib/prisma";

export async function POST(
	request: Request,
	{ params }: { params: { slug: string } },
) {
	const { userId } = await request.json();
	const slug = params.slug;

	if (!userId) return Response.json({}, { status: 400 });

	const userHasViewed = await prisma.views.findFirst({
		where: {
			userId: { equals: userId },
			slug: { equals: slug },
		},
	});

	if (userHasViewed != null) return Response.json({}, { status: 200 });

	await prisma.views.create({
		data: {
			userId,
			slug,
		},
	});

	return Response.json({}, { status: 200 });
}
