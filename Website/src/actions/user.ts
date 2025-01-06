"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getUser = async (username: string) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const user = await db.user.findUnique({
    where: {
      username
    },
    include: {
      createdProjects: {
        select: {
          id: true,
          title: true,
          type: true,
          creatorId: true,
          editorId: true,
          completed: true,
          createdAt: true,
          updatedAt: true,
          deadline: true,
          Instructions: {
            select: {
              status: true,
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      },
      editedProjects: {
        select: {
          id: true,
          title: true,
          type: true,
          creatorId: true,
          editorId: true,
          completed: true,
          createdAt: true,
          updatedAt: true,
          deadline: true,
          Instructions: {
            select: {
              status: true,
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      },
    }
  });
  return user;
}

export const updateUser = async (username: string, data: any) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const user = await db.user.update({
    where: {
      username
    },
    data
  });
  return user;
}

export const updateYoutubeRefreshToken = async (id: string, refreshToken: string) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  await db.user.update({
    where: {
      id
    },
    data: {
      youtubeRefreshToken: refreshToken
    }
  });
  await db.notification.create({
    data: {
      title: "YouTube account connected",
      message: "Your YouTube account has been successfully connected",
      type: "YOUTUBE_REFRESH",
      senderProjectRole: "SYSTEM",
      toUserId: id
    }
  });
}

export const resetRefreshToken = async (id: string) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not authenticated");
  }
  await db.user.update({
    where: {
      id,
    },
    data: {
      youtubeRefreshToken: null
    }
  });
  await db.notification.create({
    data: {
      title: "YouTube account disconnected",
      message: "Your YouTube account has been disconnected",
      type: "YOUTUBE_REFRESH",
      senderProjectRole: "SYSTEM",
      toUserId: id
    }
  });
}
