/* eslint-disable require-jsdoc */
import { sql } from "kysely";
import { NextApiRequest, NextApiResponse } from "next";

import { queryBuilder } from "@/lib/planetscale";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const userIp = (req.headers["x-real-ip"] || req.socket.remoteAddress) as string;

  if (method === "GET") {
    const { slug, userId } = req.query;
    const response = await getPostRatings(slug as string, userId as string, userIp);
    if (typeof response === "string") return res.status(500).json({ error: response });

    return res.status(200).json({ ...response });
  }

  if (method === "POST") {
    const { slug, userId, rating } = req.body;
    const insertedResult = await ratePost(
      slug as string,
      userId as string,
      userIp,
      rating as number
    );

    if (typeof insertedResult === "string") return res.status(500).json({ error: insertedResult });

    return res.status(200).json({ userRating: rating });
  }

  return res.status(405).end();
}

const getPostRatings = async (slug: string, userId: string, userIp: string) => {
  try {
    const avgPostRating = queryBuilder
      .selectFrom("post_ratings")
      .select([sql<string>`AVG(rating)`.as("avg"), sql<string>`COUNT(*)`.as("total")])
      .where("slug", "=", slug)
      .execute();

    const userAlreadyRated = queryBuilder
      .selectFrom("post_ratings")
      .select(["rating"])
      .where("slug", "=", slug)
      .where(({ or, cmpr }) => or([cmpr("user_id", "=", userId), cmpr("user_ip", "=", userIp)]))
      .execute();

    const [r1, r2] = await Promise.all([avgPostRating, userAlreadyRated]);
    return {
      averagePostRating: Number(r1[0]?.avg || 0),
      totalRatings: Number(r1[0]?.total || 0),
      userRating: r2[0]?.rating,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return "Post ratings could not be retrieved.";
  }
};

const ratePost = async (slug: string, userId: string, userIp: string, rating: number) => {
  try {
    const response = await queryBuilder
      .insertInto("post_ratings")
      .values([{ slug, rating, user_id: userId, user_ip: userIp, created_at: new Date() }])
      .execute();

    return response;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return "Post ratings could not be inserted.";
  }
};
