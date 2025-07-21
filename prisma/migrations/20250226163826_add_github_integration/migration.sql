-- AlterTable
ALTER TABLE "GithubToken" ADD COLUMN     "githubUsername" TEXT,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "tokenType" TEXT,
ALTER COLUMN "accessToken" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubOAuthState" TEXT;
