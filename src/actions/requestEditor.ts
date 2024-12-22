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
    }
  });
};

export const acceptRequest = async (id: string) => {
  const request = await db.requestEditor.update({
    where: { id },
    data: { status: "ACCEPTED" }
  });
  await requestEdit(request.projectId);
};

export const rejectRequest = async (id: string) => {
  await db.requestEditor.update({
    where: { id },
    data: { status: "REJECTED" }
  });
};