-- CreateTable
CREATE TABLE "Views" (
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Ratings" (
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Views_userId_key" ON "Views"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Ratings_userId_key" ON "Ratings"("userId");
