"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

interface CreateProjectInput {
  title: string;
  description: string;
  type: "VLOG" | "SHORT_FILM" | "COMMERCIAL" | "MUSIC_VIDEO" | "DOCUMENTARY";
  editorId: string | null;
  fileUrl: string;
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
  const { title, description, type, editorId , fileUrl, instructions, duration, deadline } = data;
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