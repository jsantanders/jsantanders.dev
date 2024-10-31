const query = `{
  viewer {
    pinnedItems(first: 6) {
      nodes {
        ... on Repository {
          id
          url
          name
          description
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          owner {
            login
          }
        }
      }
    }
  }
}`;

export const GET = async (): Promise<Response> => {
	const response = await fetch("https://api.github.com/graphql", {
		method: "POST",
		headers: {
			Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
		},
		body: JSON.stringify({ query }),
		next: {
			revalidate: 60,
		},
	}).then((r) => r.json());

	return Response.json({ repos: response.data });
};
