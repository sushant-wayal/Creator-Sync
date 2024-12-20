import { auth } from "@/auth";
import { db } from "@/lib/db";

export const uploadThumbnail = async (projectId: string, name: string, thumbnailUrl: string) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }
  const maxVersion = await db.thumbnailVersion.aggregate({
    _max: {
      version: true,
    },
    where: {
      projectId,
    },
  })
  const version = (maxVersion?._max?.version || -1) + 1;
  await db.thumbnailVersion.create({
    data: {
      projectId,
      name,
      url: thumbnailUrl,
      version
    },
  });
};