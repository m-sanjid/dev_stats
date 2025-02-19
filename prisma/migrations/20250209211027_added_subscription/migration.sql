/*
  Warnings:

  - You are about to drop the column `repoId` on the `GitHubWebhook` table. All the data in the column will be lost.
  - The `subscription` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,repoName]` on the table `GitHubWebhook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `repoName` to the `GitHubWebhook` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('free', 'pro');

-- DropIndex
DROP INDEX "GitHubWebhook_userId_repoId_key";

-- AlterTable
ALTER TABLE "GitHubWebhook" DROP COLUMN "repoId",
ADD COLUMN     "repoName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "subscription",
ADD COLUMN     "subscription" "SubscriptionType" NOT NULL DEFAULT 'free';

-- DropEnum
DROP TYPE "Subscription";

-- CreateIndex
CREATE UNIQUE INDEX "GitHubWebhook_userId_repoName_key" ON "GitHubWebhook"("userId", "repoName");
