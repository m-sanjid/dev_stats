-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_gitHubMetricsId_fkey";

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_gitHubMetricsId_fkey" FOREIGN KEY ("gitHubMetricsId") REFERENCES "GitHubMetrics"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
