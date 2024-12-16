/*
  Warnings:

  - You are about to drop the column `Rating` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Rating",
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0;
