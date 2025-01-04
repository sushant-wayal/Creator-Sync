/*
  Warnings:

  - Added the required column `senderProjectRole` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PROJECT_UPDATE', 'REQUEST_EDIT', 'REQUEST_EDITOR', 'ACCEPT_REQUEST_EDIT', 'ACCEPT_REQUEST_EDITOR', 'REJECT_EDIT', 'REJECT_EDITOR', 'COMPLETED_PROJECT', 'RATING', 'PAYMENT', 'EMAIL_VERIFICATION', 'PASSWORD_RESET', 'YOUTUBE_REFRESH');

-- CreateEnum
CREATE TYPE "UserProjectRole" AS ENUM ('CREATOR', 'EDITOR');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "senderProjectRole" "UserProjectRole" NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "NotificationType" NOT NULL;
