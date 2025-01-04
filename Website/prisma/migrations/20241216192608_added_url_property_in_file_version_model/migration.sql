/*
  Warnings:

  - Added the required column `url` to the `FileVersion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_editorId_fkey";

-- AlterTable
ALTER TABLE "FileVersion" ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "editorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
