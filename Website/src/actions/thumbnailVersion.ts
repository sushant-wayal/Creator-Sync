"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const uploadThumbnail = async (projectId: string, name: string, thumbnailUrl: string) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }
  const project = await db.project.findFirst({
    where: {
      id: projectId,
    },
    select: {
      creatorId: true,
      _count: {
        select: {
          ThumbnailVersion: true,
        },
      }
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const version = project._count.ThumbnailVersion;
  await db.thumbnailVersion.create({
    data: {
      projectId,
      name,
      url: thumbnailUrl,
      version
    },
  });
  if (!session.user.id) {
    throw new Error("User not found");
  }
  await db.notification.create({
    data: {
      title: "New Thumbnail uploaded",
      message: `New Thumbnail uploaded for project`,
      type: "PROJECT_UPDATE",
      senderProjectRole: "EDITOR",
      projectId,
      fromUserId: session.user.id,
      toUserId: project.creatorId,
    },
  });
};