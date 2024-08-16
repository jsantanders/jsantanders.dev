-- DropIndex
DROP INDEX "Ratings_userId_key";

-- DropIndex
DROP INDEX "Views_userId_key";

-- AlterTable
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_pkey" PRIMARY KEY ("userId", "slug");

-- AlterTable
ALTER TABLE "Views" ADD CONSTRAINT "Views_pkey" PRIMARY KEY ("userId", "slug");
