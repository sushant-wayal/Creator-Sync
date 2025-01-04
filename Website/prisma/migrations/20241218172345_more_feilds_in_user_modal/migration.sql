-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "instagramLink" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "website" TEXT,
ADD COLUMN     "xLink" TEXT,
ADD COLUMN     "youtubeLink" TEXT;
