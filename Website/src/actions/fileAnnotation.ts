"use server";

import { auth } from "@/auth"
import { db } from "@/lib/db";

export const getFileAnnotations = async (FileVersionId: string) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not authenticated");
  }
  return await db.fileAnnotation.findMany({
    where: {
      FileVersionId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export const createFileAnnotation = async ({ FileVersionId, x, y, content, timeStamp } : {
  FileVersionId: string,
  x: number,
  y: number,
  content: string,
  timeStamp: number
}) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not authenticated");
  }
  await db.fileAnnotation.create({
    data: {
      FileVersionId,
      x,
      y,
      content,
      timeStamp,
    }
  });
  const fileVersion = await db.fileVersion.findUnique({
    where: {
      id: FileVersionId
    },
    include: {
      project: true
    }
  });
  if (!fileVersion) {
    throw new Error("FileVersion not found");
  }
  if (!fileVersion.project.editorId) {
    throw new Error("Project editor not found");
  }
  await db.notification.create({
    data: {
      title: "New annotation",
      message: `New annotation on file version - ${fileVersion.version} ${fileVersion.name} of ${fileVersion.project.title}`,
      type: "NEW_ANNOTATION",
      senderProjectRole: "CREATOR",
      projectId: fileVersion.project.id,
      fromUserId: session.user.id,
      toUserId: fileVersion.project.editorId,
    }
  });
}

export const resolveFileAnnotation = async (id: string) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not authenticated");
  }
  const annotation = await db.fileAnnotation.update({
    where: {
      id
    },
    data: {
      resolved: true
    }
  });
  const fileVersion = await db.fileVersion.findUnique({
    where: {
      id: annotation.FileVersionId
    },
    include: {
      project: true
    }
  });
  if (!fileVersion) {
    throw new Error("FileVersion not found");
  }
  if (!fileVersion.project.editorId) {
    throw new Error("Project editor not found");
  }
  await db.notification.create({
    data: {
      title: "Annotation Resolved",
      message: `Annotation on file version ${fileVersion.version} ${fileVersion.name} of ${fileVersion.project.title}`,
      type: "RESOLVED_ANNOTATION",
      senderProjectRole: "CREATOR",
      projectId: fileVersion.project.id,
      fromUserId: session.user.id,
      toUserId: fileVersion.project.creatorId
    }
  })
}