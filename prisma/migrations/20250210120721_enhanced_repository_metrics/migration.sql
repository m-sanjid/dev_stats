-- AlterTable
ALTER TABLE "GitHubMetrics" ADD COLUMN     "contributedRepos" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dailyActivity" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "languages" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "totalIssues" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPRs" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "branches" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "defaultBranch" TEXT NOT NULL DEFAULT 'main',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "forks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "lastPushed" TIMESTAMP(3),
ADD COLUMN     "license" TEXT,
ADD COLUMN     "openIssues" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "size" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stars" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "topics" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "url" TEXT,
ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'public',
ADD COLUMN     "watchers" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Repository_language_idx" ON "Repository"("language");

-- CreateIndex
CREATE INDEX "Repository_lastPushed_idx" ON "Repository"("lastPushed");

-- CreateIndex
CREATE INDEX "Repository_stars_idx" ON "Repository"("stars");
