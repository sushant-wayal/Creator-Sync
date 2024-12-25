-- CreateTable
CREATE TABLE "FileAnnotation" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timeStamp" INTEGER NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "FileVersionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileAnnotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThumbnailAnnotation" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "ThumbnailVersionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThumbnailAnnotation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileAnnotation" ADD CONSTRAINT "FileAnnotation_FileVersionId_fkey" FOREIGN KEY ("FileVersionId") REFERENCES "FileVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThumbnailAnnotation" ADD CONSTRAINT "ThumbnailAnnotation_ThumbnailVersionId_fkey" FOREIGN KEY ("ThumbnailVersionId") REFERENCES "ThumbnailVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
