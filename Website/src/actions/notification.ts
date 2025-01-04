"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const requestDeadlineExtension = async (projectId: string,  days: number) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) throw new Error("Unauthorized");
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Project not found");
  const toUserId = project.creatorId;
  await db.notification.create({
    data: {
      title: "Deadline Extension Request",
      message: `User ${session.user.name} has requested a deadline extension of ${days} days`,
      type: "REQUEST_DEADLINE_EXTENSION",
      senderProjectRole: "EDITOR",
      projectId,
      fromUserId: session.user.id,
      toUserId: toUserId,
    }
  });
};

export const getNotifications = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) throw new Error("Unauthorized");
  const userId = session.user.id;
  return await db.notification.findMany({
    where: {
      toUserId: userId,
    },
    include: {
      from: {
        select: {
          name: true,
          profilePicture: true,
        }
      },
      project: {
        select: {
          title: true,
        }
      },
    },
    orderBy: {
      createdAt: "desc",
    }
  });
}

export const markAsRead = async (notificationId: string) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) throw new Error("Unauthorized");
  const userId = session.user.id;
  const notification = await db.notification.findUnique({ where: { id: notificationId } });
  if (!notification) throw new Error("Notification not found");
  if (notification.toUserId !== userId) throw new Error("Unauthorized");
  await db.notification.update({
    where: { id: notificationId },
    data: {
      read: true,
    }
  });
}

export const markAllAsRead = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) throw new Error("Unauthorized");
  const userId = session.user.id;
  await db.notification.updateMany({
    where: {
      toUserId: userId,
    },
    data: {
      read: true,
    }
  });
}

export const markAllOfProjectAsRead = async (projectId: string) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) throw new Error("Unauthorized");
  const userId = session.user.id;
  await db.notification.updateMany({
    where: {
      toUserId: userId,
      projectId,
    },
    data: {
      read: true,
    }
  });
}

export const totalUnreadNotifications = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) throw new Error("Unauthorized");
  const userId = session.user.id;
  return await db.notification.count({
    where: {
      toUserId: userId,
      read: false,
    }
  });
}