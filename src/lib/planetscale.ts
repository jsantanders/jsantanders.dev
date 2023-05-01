import { Generated, Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";

interface PostViewsTable {
  id: Generated<number>;
  slug: string;
  user_id: string;
  user_ip: string;
  created_at: Date;
}

interface PostRatingsTable {
  id: Generated<number>;
  slug: string;
  rating: number;
  user_id: string;
  user_ip: string;
  created_at: Date;
}

interface Database {
  post_views: PostViewsTable;
  post_ratings: PostRatingsTable;
}

export const queryBuilder = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  }),
});
