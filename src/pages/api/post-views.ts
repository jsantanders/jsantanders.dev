/* eslint-disable require-jsdoc */
import { sql } from "kysely";
import { NextApiRequest, NextApiResponse } from "next";

import { queryBuilder } from "@/lib/planetscale";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const userIp = (req.headers["x-real-ip"] || req.socket.remoteAddress) as string;

  if (method === "GET") {
    const { slug, userId } = req.query;
    const response = await getPostViews(slug as string, userId as string, userIp);
    if (typeof response === "string") return res.status(500).json({ error: response });

    return res.status(200).json({ ...response });
  }

  if (method === "POST") {
    const { slug, userId } = req.body;
    const result = await incrementPostViews(slug as string, userId as string, userIp);
    if (typeof result === "string") return res.status(500).json({ error: result });

    return res.status(204).end();
  }

  return res.status(405).end();
}

const getPostViews = async (slug: string, userId: string, userIp: string) => {
  try {
    const viewCount = queryBuilder
      .selectFrom("post_views")
      .select([sql<string>`COUNT(*)`.as("count")])
      .where("slug", "=", slug)
      .execute();

    const userAlreadyViewed = queryBuilder
      .selectFrom("post_views")
      .select([sql<string>`COUNT(*)`.as("userViewed")])
      .where("slug", "=", slug)
      .where(({ or, cmpr }) => or([cmpr("user_id", "=", userId), cmpr("user_ip", "=", userIp)]))
      .execute();

    const [r1, r2] = await Promise.all([viewCount, userAlreadyViewed]);
    return {
      postViews: Number(r1[0]?.count ?? 0),
      userViewed: r2[0]?.userViewed && Number(r2[0]?.userViewed) > 0,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return "Post views could not be retrieved.";
  }
};

const incrementPostViews = async (slug: string, userId: string, userIp: string) => {
  try {
    const response = await queryBuilder
      .insertInto("post_views")
      .values([{ slug, user_id: userId, user_ip: userIp, created_at: new Date() }])
      .execute();

    return response;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return "Post views could not be incremented.";
  }
};
