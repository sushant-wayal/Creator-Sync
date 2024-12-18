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
      creatorId: true
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.creatorId != userId) {
    throw new Error("User not authorized");
  }
  await db.instructions.create({
    data: {
      content,
      nature,
      projectId,
      status: "PENDING"
    }
  });
}

export const completeInstruction = async (instructionIds: string[]) => {
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
    }
  });
}