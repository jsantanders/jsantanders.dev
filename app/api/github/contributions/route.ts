import type { ApiResponse } from "@/components/code-frecuency-calendar";

const query = `{
  viewer {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        months {
          name
          totalWeeks
        }
        weeks {
          contributionDays {
              contributionCount
              contributionLevel
              date
              weekday
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
	});

	if (!response.ok)
		return Response.json({ error: await response.text() }, { status: 503 });

	const data = (await response.json()).data as Github;

	const result: ApiResponse = {
		total: {
			lastYear:
				data.viewer.contributionsCollection.contributionCalendar
					.totalContributions,
		},
		contributions:
			data.viewer.contributionsCollection.contributionCalendar.weeks
				.flatMap((week) => week.contributionDays)
				.map((day) => ({
					date: day.date,
					count: day.contributionCount,
					level: {
						NONE: 0,
						FIRST_QUARTILE: 1,
						SECOND_QUARTILE: 2,
						THIRD_QUARTILE: 3,
						FOURTH_QUARTILE: 4,
					}[day.contributionLevel] as 0 | 1 | 2 | 3 | 4,
				})),
	};

	return Response.json(result);
};

type Github = {
	viewer: {
		contributionsCollection: {
			contributionCalendar: {
				totalContributions: number;
				weeks: {
					contributionDays: {
						contributionCount: number;
						contributionLevel:
							| "NONE"
							| "FIRST_QUARTILE"
							| "SECOND_QUARTILE"
							| "THIRD_QUARTILE"
							| "FOURTH_QUARTILE";
						date: string;
					}[];
				}[];
			};
		};
	};
};
