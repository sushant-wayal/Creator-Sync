"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";

export interface Editor {
  id: string;
  name: string;
  profilePicture: string | null;
  rating: number;
  totalProjects: number;
}

export const getEditors = async (): Promise<Editor[]> => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const { id } = session.user;
  const editors = await db.user.findMany({
    where: {
      editedProjects: {
        some: {
          creatorId: id
        }
      }
    },
    select: {
      id: true,
      name: true,
      profilePicture: true,
      rating: true,
      _count: {
        select: {
          editedProjects: true
        }
      }
    },
    take: 4,
    orderBy: {
      rating: 'desc'
    }
  });
  if (editors.length < 4) {
    const remainingEditors = await db.user.findMany({
      where: {
        NOT: {
          id
        },
        editedProjects: {
          none: {
            creatorId: id
          }
        },
        readyToEdit: true
      },
      select: {
        id: true,
        name: true,
        profilePicture: true,
        rating: true,
        _count: {
          select: {
            editedProjects: true
          }
        }
      },
      take: 4 - editors.length,
      orderBy: {
        rating: 'desc'
      }
    });
    editors.push(...remainingEditors);
  }
  return editors.map(({ id, name, profilePicture, rating, _count : { editedProjects : totalProjects } }) => ({
    id,
    name,
    profilePicture,
    rating,
    totalProjects
  }));
}

export const getSearchEditors = async (search: string): Promise<Editor[]> => {
  const editors = await db.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search
          }
        },
        {
          username: {
            contains: search
          }
        }
      ],
      readyToEdit: true
    },
    select: {
      id: true,
      name: true,
      profilePicture: true,
      rating: true,
      _count: {
        select: {
          editedProjects: true
        }
      }
    },
    take: 4,
    orderBy: {
      rating: 'desc'
    }
  });
  return editors.map(editor => ({
    id: editor.id,
    name: editor.name,
    profilePicture: editor.profilePicture,
    rating: editor.rating,
    totalProjects: editor._count.editedProjects
  }));
}

export const getEditorsToRequest = async (projectId : string) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const { id } = session.user;
  const editors = await db.user.findMany({
    where: {
      NOT: {
        id,
      },
      readyToEdit: true,
      requestEditor: {
        none: {
          projectId
        }
      }
    },
    select: {
      id: true,
      name: true,
      username: true,
      profilePicture: true,
      skills: true,
      rating: true,
      _count: {
        select: {
          editedProjects: {
            where: {
              completed: true
            }
          }
        }
      },
      editedProjects: {
        where: {
          completed: false
        },
        select: {
          deadline: true
        },
        orderBy: {
          deadline: 'desc'
        },
        take: 1
      }
    },
    orderBy: {
      rating: 'desc'
    }
  });
  return editors
}

export const rateEditor = async (editorId: string, projectId: string, rating: number) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not authenticated");
  }
  const editor = await db.user.findUnique({
    where: {
      id: editorId
    },
    select: {
      rating: true
    }
  });
  if (!editor) {
    throw new Error("Editor not found");
  }
  const updatedRating = (editor.rating + rating) / (editor.rating ? 2 : 1);
  await db.user.update({
    where: {
      id: editorId
    },
    data: {
      rating: updatedRating
    }
  });
  await db.notification.create({
    data: {
      title: "Rating Received",
      message: `You received a rating of ${rating} from a creator`,
      type: "RATING",
      senderProjectRole: "CREATOR",
      projectId,
      fromUserId: session.user.id,
      toUserId: editorId
    }
  })
}