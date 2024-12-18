import { auth } from "@/auth";
import { db } from "@/lib/db";

export const uploadNewVersion = async (projectId: string, fileUrl: string, fileName: string) => {
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
      editorId: true,
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.editorId != userId) {
    throw new Error("User not authorized");
  }
  const latestFile = await db.fileVersion.findFirst({
    where: {
      projectId
    },
    orderBy: {
      version: "desc"
    },
    select: {
      version: true
    },
  });
  if (!latestFile) {
    throw new Error("File not found");
  }
  const newVersion = latestFile.version + 1;
  await db.fileVersion.create({
    data: {
      projectId,
      url: fileUrl,
      name: fileName,
      version: newVersion
    }
  });
}