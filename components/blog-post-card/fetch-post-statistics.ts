export const getBlogPostStatistics = async (slug: string) => {
	const response = await fetch(`/api/blog/${slug}/statistics`);
	if (response.ok) {
		return (await response.json()) as {
			views: number;
			rating: { average: number; total: number };
			userHasRated: boolean;
		};
	}
	throw Error(
		`blog post views query failed. ${response.status} :: ${await response.text()}`,
	);
};

export const rateBlogPost = async (
	slug: string,
	userId: string,
	rating: number,
) => {
	try {
		const response = await fetch(`/api/blog/${slug}/ratings`, {
			method: "POST",
			body: JSON.stringify({ userId, rating }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		throw Error(
			`blog post views query failed. ${response.status} :: ${await response.text()}`,
		);
	} catch (e) {
		console.log("Error posting rating ::", e);
		throw e;
	}
};
