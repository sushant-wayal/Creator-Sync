"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const requestRevision = async (projectId: string, content: string, nature: "COMPULSORY" | "OPTIONAL") => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const userId = session.user.id;
  if (!userId) {
    throw new Error("User ID is undefined");
  }
  const project = await db.project.findFirst({
    where: {
      id: projectId
    },
    select: {
      creatorId: true,
      editorId: true
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.creatorId != userId) {
    throw new Error("User not authorized");
  }
  if (project.editorId == null) {
    throw new Error("Project editor not assigned");
  }
  await db.instructions.create({
    data: {
      content,
      nature,
      projectId,
      status: "PENDING"
    }
  });
  await db.notification.create({
    data: {
      title: "New Instruction Request",
      message: `You have a new instruction request : ${content}`,
      type: "INSTRUCTION_UPDATE",
      senderProjectRole: "CREATOR",
      projectId,
      fromUserId: userId,
      toUserId: project.editorId,
    }
  });
}

export const completeInstruction = async (instructionIds: string[], projectId : string) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const userId = session.user.id;
  if (!userId) {
    throw new Error("User ID is undefined");
  }
  await db.instructions.updateMany({
    where: {
      id: {
        in: instructionIds
      }
    },
    data: {
      status: "COMPLETED"
    },
  });
  const project = await db.project.findFirst({
    where: {
      id: projectId
    }});
  if (!project) {
    throw new Error("Project not found");
  }
  const toUserId = project.creatorId;
  await db.notification.create({
    data: {
      title: "Instructions Completed",
      message: `${instructionIds.length} instructions have been completed the instructions`,
      type: "INSTRUCTION_UPDATE",
      senderProjectRole: "EDITOR",
      projectId,
      fromUserId: userId,
      toUserId,
    }
  });
}