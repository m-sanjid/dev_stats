-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "webhookId" TEXT;

-- CreateTable
CREATE TABLE "GithubWebhook" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GithubWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GithubWebhook_userId_repoName_key" ON "GithubWebhook"("userId", "repoName");

-- AddForeignKey
ALTER TABLE "GithubWebhook" ADD CONSTRAINT "GithubWebhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
