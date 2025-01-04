"use server";

import { auth } from "@/auth"
import { db } from "@/lib/db";

export const getThumbnailAnnotations = async (ThumbnailVersionId: string) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not authenticated");
  }
  return await db.thumbnailAnnotation.findMany({
    where: {
      ThumbnailVersionId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export const createThumbnailAnnotation = async (ThumbnailVersionId: string, x: number, y: number, content: string) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not authenticated");
  }
  await db.thumbnailAnnotation.create({
    data: {
      ThumbnailVersionId,
      x,
      y,
      content,
    }
  });
  const thumbnailVersion = await db.thumbnailVersion.findUnique({
    where: {
      id: ThumbnailVersionId
    },
    include: {
      project: true
    }
  });
  if (!thumbnailVersion) {
    throw new Error("Thumbnail Version not found");
  }
  if (!thumbnailVersion.project.editorId) {
    throw new Error("Project editor not found");
  }
  await db.notification.create({
    data: {
      title: "New annotation",
      message: `New annotation on thumbnail version - ${thumbnailVersion.version} ${thumbnailVersion.name} of ${thumbnailVersion.project.title}`,
      type: "NEW_ANNOTATION",
      senderProjectRole: "CREATOR",
      projectId: thumbnailVersion.project.id,
      fromUserId: session.user.id,
      toUserId: thumbnailVersion.project.editorId,
    }
  });
}

export const resolveThumbnailAnnotation = async (id: string) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not authenticated");
  }
  const annotation = await db.thumbnailAnnotation.update({
    where: {
      id
    },
    data: {
      resolved: true
    }
  });
  const thumbnailVersion = await db.thumbnailVersion.findUnique({
    where: {
      id: annotation.ThumbnailVersionId
    },
    include: {
      project: true
    }
  });
  if (!thumbnailVersion) {
    throw new Error("FileVersion not found");
  }
  if (!thumbnailVersion.project.editorId) {
    throw new Error("Project editor not found");
  }
  await db.notification.create({
    data: {
      title: "Annotation Resolved",
      message: `Annotation on thumbnail version ${thumbnailVersion.version} ${thumbnailVersion.name} of ${thumbnailVersion.project.title}`,
      type: "RESOLVED_ANNOTATION",
      senderProjectRole: "CREATOR",
      projectId: thumbnailVersion.project.id,
      fromUserId: session.user.id,
      toUserId: thumbnailVersion.project.creatorId
    }
  });
}