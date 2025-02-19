/*
  Warnings:

  - You are about to drop the column `repositories` on the `GitHubMetrics` table. All the data in the column will be lost.
  - You are about to drop the column `repoName` on the `GitHubWebhook` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,repoId]` on the table `GitHubWebhook` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[githubUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `repoId` to the `GitHubWebhook` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GitHubWebhook_userId_repoName_key";

-- AlterTable
ALTER TABLE "GitHubMetrics" DROP COLUMN "repositories",
ADD COLUMN     "mergedPRs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "repoStars" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "GitHubWebhook" DROP COLUMN "repoName",
ADD COLUMN     "repoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "gitHubMetricsId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubUsername" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GitHubWebhook_userId_repoId_key" ON "GitHubWebhook"("userId", "repoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubUsername_key" ON "User"("githubUsername");

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_gitHubMetricsId_fkey" FOREIGN KEY ("gitHubMetricsId") REFERENCES "GitHubMetrics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
