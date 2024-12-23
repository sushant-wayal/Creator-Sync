/*
  Warnings:

  - The values [REJECT_EDIT,REJECT_EDITOR] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('PROJECT_UPDATE', 'INSTRUCTION_UPDATE', 'DEADLINE_EXTENDED', 'REQUEST_DEADLINE_EXTENSION', 'REQUEST_EDIT', 'REQUEST_EDITOR', 'ACCEPT_REQUEST_EDIT', 'ACCEPT_REQUEST_EDITOR', 'COMPLETED_PROJECT', 'RATING', 'PAYMENT', 'EMAIL_VERIFICATION', 'PASSWORD_RESET', 'YOUTUBE_REFRESH');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;
