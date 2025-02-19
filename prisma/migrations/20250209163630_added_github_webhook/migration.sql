/*
  Warnings:

  - You are about to drop the `GithubWebhook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GithubWebhook" DROP CONSTRAINT "GithubWebhook_userId_fkey";

-- DropTable
DROP TABLE "GithubWebhook";

-- CreateTable
CREATE TABLE "GitHubWebhook" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GitHubWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubWebhook_userId_repoName_key" ON "GitHubWebhook"("userId", "repoName");

-- AddForeignKey
ALTER TABLE "GitHubWebhook" ADD CONSTRAINT "GitHubWebhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
