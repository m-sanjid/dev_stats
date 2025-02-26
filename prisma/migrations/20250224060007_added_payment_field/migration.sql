/*
  Warnings:

  - You are about to drop the column `customerEmail` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "customerEmail",
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "shippingAddress" JSONB,
ADD COLUMN     "shippingName" TEXT;
