-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_gitHubMetricsId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "useWebhook" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_gitHubMetricsId_fkey" FOREIGN KEY ("gitHubMetricsId") REFERENCES "GitHubMetrics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
