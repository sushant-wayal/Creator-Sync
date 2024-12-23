"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { requestEdit } from "./requestEdit";

export const requestEditor = async (projectId: string, editorId: string) => {
  await db.requestEditor.create({
    data: {
      projectId,
      editorId
    }
  });
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { creatorId: true }
  });
  if (!project) throw new Error("Project not found");
  const creatorId = project.creatorId;
  await db.notification.create({
    data: {
      title: "Request to edit project",
      message: "You have a request to edit a project",
      senderProjectRole: "CREATOR",
      type: "REQUEST_EDITOR",
      projectId,
      fromUserId: creatorId,
      toUserId: editorId
    }
  });
};

export const getRequestEditors = async () => {
  const session = await auth();
  if (!session || !session.user) throw new Error("Not authenticated");
  const editorId = session.user.id;
  const user = await db.user.findUnique({
    where: { id: editorId },
    select: { readyToEdit: true }
  });
  if (!user?.readyToEdit) throw new Error("Not authorized");
  return db.requestEditor.findMany({
    where: {
      editorId,
      status: "PENDING"
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
      project: {
        select: {
          id: true,
          title: true,
          type: true,
          duration: true,
          deadline: true,
          creator: {
            select: {
              name: true,
              username: true,
              profilePicture: true,
              _count: {
                select: {
                  createdProjects: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

export const acceptRequest = async (id: string) => {
  const request = await db.requestEditor.update({
    where: { id },
    data: { status: "ACCEPTED" },
    include: { project: true }
  });
  await requestEdit(request.projectId, false);
  await db.notification.create({
    data: {
      title: "Request accepted",
      message: "Editor is ready to edit your project",
      senderProjectRole: "EDITOR",
      type: "ACCEPT_REQUEST_EDITOR",
      projectId: request.projectId,
      fromUserId: request.editorId,
      toUserId: request.project.creatorId
    }
  });
};

export const rejectRequest = async (id: string) => {
  await db.requestEditor.update({
    where: { id },
    data: { status: "REJECTED" }
  });
};