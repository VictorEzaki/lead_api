/*
  Warnings:

  - You are about to drop the column `cretedAt` on the `Lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "cretedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
