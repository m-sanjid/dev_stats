-- CreateTable
CREATE TABLE "GitHubMetrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalCommits" INTEGER NOT NULL DEFAULT 0,
    "totalLines" INTEGER NOT NULL DEFAULT 0,
    "repositories" JSONB NOT NULL DEFAULT '{}',
    "weeklyCommits" JSONB NOT NULL DEFAULT '{}',
    "githubProfile" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubMetrics_userId_key" ON "GitHubMetrics"("userId");

-- AddForeignKey
ALTER TABLE "GitHubMetrics" ADD CONSTRAINT "GitHubMetrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
