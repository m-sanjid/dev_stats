-- CreateEnum
CREATE TYPE "Subscription" AS ENUM ('free', 'pro');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscription" "Subscription" NOT NULL DEFAULT 'free';
