/*
  Warnings:

  - Added the required column `deadline` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL;
