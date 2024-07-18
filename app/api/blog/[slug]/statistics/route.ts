export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  return Response.json({ views: 10, rating: { average: 2.5, total: 10 }, userHasRated: true });
}
