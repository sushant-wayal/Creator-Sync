import { auth } from "@/auth"
import { db } from "@/lib/db"

export const requestEdit = async (projectId: string) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("You need to be logged in to request an edit");
  }
  const userId = session.user.id;
  if (!userId) {
    throw new Error("You need to be logged in to request an edit");
  }
  await db.requestEdit.create({
    data: {
      projectId,
      editorId: userId
    }
  })
}

export const rejectEditRequest = async (requestEditId: string) => {
  await db.requestEdit.update({
    where: {
      id: requestEditId
    },
    data: {
      status: "REJECTED"
    }
  });
};

export const acceptEditRequest = async (requestEditId: string) => {
  const { projectId, editorId } = await db.requestEdit.update({
    where: {
      id: requestEditId
    },
    data: {
      status: "ACCEPTED"
    }
  });
  await db.project.update({
    where: {
      id: projectId
    },
    data: {
      editorId: editorId
    }
  });
};