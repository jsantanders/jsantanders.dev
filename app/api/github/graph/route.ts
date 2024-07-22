import type { GraphData } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

const query = `{
  viewer {
    contributionsCollection {
      contributionCalendar {
        months {
          name
          totalWeeks
        }
        weeks {
          contributionDays {
            contributionLevel
            contributionCount
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
	}).then((r) => r.json());
	console.log(response);
	return Response.json({ graph: response.data });
};
