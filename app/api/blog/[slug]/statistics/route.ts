import { generateId } from "@/lib/generate-id";
import { prisma } from "@/lib/prisma";

export async function GET(
	request: Request,
	{ params }: { params: { slug: string } },
) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("uniqueId") ?? generateId();
	const slug = params.slug;

	const rattingsAggregations = await prisma.ratings.aggregate({
		_avg: {
			rate: true,
		},
		_count: {
			rate: true,
		},
		where: {
			slug: { equals: slug },
		},
	});

	const rating = await prisma.ratings.findFirst({
		select: {
			userId: true,
			rate: true,
		},
		where: {
			userId: { equals: userId },
		},
	});

	const viewsAggregations = await prisma.views.aggregate({
		_count: {
			slug: true,
		},
		where: {
			slug: { equals: slug },
		},
	});

	return Response.json({
		views: viewsAggregations._count.slug,
		rating: {
			average: rattingsAggregations._avg.rate,
			total: rattingsAggregations._count.rate,
		},
		userHasRated: !!rating,
	});
}
