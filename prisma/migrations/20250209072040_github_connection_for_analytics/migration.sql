-- CreateTable
CREATE TABLE "GithubToken" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GithubToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastSynced" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubCommit" (
    "id" TEXT NOT NULL,
    "sha" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "estimatedTime" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GithubCommit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommitFIle" (
    "id" TEXT NOT NULL,
    "commitId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "additions" INTEGER NOT NULL,
    "deletions" INTEGER NOT NULL,
    "changes" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "CommitFIle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GithubToken_userId_key" ON "GithubToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_userId_name_key" ON "Repository"("userId", "name");

-- CreateIndex
CREATE INDEX "GithubCommit_userId_idx" ON "GithubCommit"("userId");

-- CreateIndex
CREATE INDEX "GithubCommit_timestamp_idx" ON "GithubCommit"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "GithubCommit_sha_repositoryId_key" ON "GithubCommit"("sha", "repositoryId");

-- CreateIndex
CREATE INDEX "CommitFIle_commitId_idx" ON "CommitFIle"("commitId");

-- AddForeignKey
ALTER TABLE "GithubToken" ADD CONSTRAINT "GithubToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubCommit" ADD CONSTRAINT "GithubCommit_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubCommit" ADD CONSTRAINT "GithubCommit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitFIle" ADD CONSTRAINT "CommitFIle_commitId_fkey" FOREIGN KEY ("commitId") REFERENCES "GithubCommit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
