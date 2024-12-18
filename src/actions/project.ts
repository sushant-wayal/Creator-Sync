"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

interface CreateProjectInput {
  title: string;
  description: string;
  type: "VLOG" | "SHORT_FILM" | "COMMERCIAL" | "MUSIC_VIDEO" | "DOCUMENTARY";
  editorId: string | null;
  fileUrl: string;
  fileName: string;
  duration: number;
  deadline: Date;
  instructions: {
    content: string;
    nature: "COMPULSORY" | "OPTIONAL";
  }[];
}

export const createProject = async (data: CreateProjectInput) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const creatorId = session.user.id;
  if (!creatorId) {
    throw new Error("Creator ID is undefined");
  }
  const { title, description, type, editorId , fileUrl, instructions, duration, deadline, fileName } = data;
  await db.project.create({
    data: {
      title,
      description,
      type,
      creatorId,
      editorId,
      duration,
      deadline,
      FileVersion: {
        create: {
          version: 0,
          url: fileUrl,
          name: fileName
        },
      },
      Instructions: {
        create: instructions.map(({ content, nature }) => ({
          content,
          nature,
        })),
      }
    }
  });
}

export const getProject = async (id: string) => {
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
      id
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
          _count: {
            select: {
              createdProjects: true
            }
          }
        }
      },
      editor: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
          rating: true,
        }
      },
      Instructions: {
        select: {
          id: true,
          content: true,
          nature: true,
          status: true
        }
      },
      FileVersion: {
        select: {
          id: true,
          version: true,
          url: true,
          name: true,
          createdAt: true
        }
      }
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.creator.id != userId || project.editorId != userId) {
    throw new Error("User not authorized");
  }
  return {
    ...project,
    isCreator: project.creator.id == userId,
  };
}

export const extendDeadline = async (projectId: string, days: number) => {
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
      deadline: true
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.creatorId != userId) {
    throw new Error("User not authorized");
  }
  await db.project.update({
    where: {
      id: projectId
    },
    data: {
      deadline: new Date(new Date(project.deadline).getTime() + days * 24 * 60 * 60 * 1000)
    }
  });
}