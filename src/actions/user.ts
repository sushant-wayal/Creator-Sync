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