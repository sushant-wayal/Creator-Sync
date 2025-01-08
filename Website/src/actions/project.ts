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
  budget: number;
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
  const { title, description, type, editorId , fileUrl, instructions, duration, deadline, budget, fileName } = data;
  const { id } = await db.project.create({
    data: {
      title,
      description,
      type,
      creatorId,
      requestEditors: editorId ? {
        create: {
          editorId
        }
      } : undefined,
      duration,
      deadline,
      budget,
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
  if (editorId) {
    await db.notification.create({
      data: {
        title: "Request to edit project",
        message: "You have a request to edit a project",
        senderProjectRole: "CREATOR",
        type: "REQUEST_EDITOR",
        projectId: id,
        fromUserId: creatorId,
        toUserId: editorId
      }
    });
  }
  return id;
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
          _count: {
            select: {
              editedProjects: {
                where: {
                  completed: true
                }
              }
            }
          }
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
        },
        orderBy: {
          version: "desc"
        }
      },
      ThumbnailVersion: {
        select: {
          id: true,
          url: true,
          name: true,
          version: true,
          createdAt: true
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      requests: {
        where: {
          status: "PENDING"
        },
        select: {
          id: true,
          createdAt: true,
          budget: true,
          editor: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
              rating: true,
              skills: true,
              accountAddress: true,
              _count: {
                select: {
                  editedProjects: {
                    where: {
                      completed: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.editorId && (project.creator.id != userId && project.editorId != userId)) {
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
      deadline: true,
      editorId: true
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
  if (project.editorId) {
    await db.notification.create({
      data: {
        title: "Deadline Extended",
        message: `The deadline for the project has been extended by ${days} days`,
        type: "DEADLINE_EXTENDED",
        senderProjectRole: "CREATOR",
        projectId,
        fromUserId: userId,
        toUserId: project.editorId
      }
    });
  }
}

export const getAllProjects = async () => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const userId = session.user.id;
  if (!userId) {
    throw new Error("User ID is undefined");
  }
  const projects = await db.project.findMany({
    where: {
      NOT: {
        OR: [
          { creatorId: userId },
          { editorId: userId }
        ]
      },
      requests: {
        none: {
          editorId: userId
        }
      }
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
          youtubeRefreshToken: true
        }
      },
      Instructions: {
        select: {
          nature: true,
        }
      },
      requests: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc"
    }
  })
  return projects.map(project => {
    const compulsoryInstructions = project.Instructions.filter(instruction => instruction.nature == "COMPULSORY").length;
    const optionalInstructions = project.Instructions.filter(instruction => instruction.nature == "OPTIONAL").length;
    return {
      ...project,
      _count: {
        requests: project.requests.length,
        compulsoryInstructions,
        optionalInstructions
      },
    }
  });
}