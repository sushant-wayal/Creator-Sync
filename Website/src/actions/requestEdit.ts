"use server";

import { auth } from "@/auth"
import { db } from "@/lib/db"
import axios from "axios";

export const requestEdit = async (projectId: string, budget: number, notify : boolean = true) => {
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
      editorId: userId,
      budget,
    }
  })
  const project = await db.project.findUnique({
    where: {
      id: projectId
    },
    select: {
      creatorId: true
    }
  });
  if (!project || !project.creatorId) {
    throw new Error("Project not found");
  }
  const toUserId = project.creatorId;
  if (notify) {
    await db.notification.create({
      data: {
        title: "Project edit request",
        message: `${session.user.name} has requested to edit your project`,
        type: "REQUEST_EDIT",
        senderProjectRole: "EDITOR",
        projectId,
        fromUserId: userId,
        toUserId
      }
    });
  }
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
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("You need to be logged in to request an edit");
  }
  const userId = session.user.id;
  if (!userId) {
    throw new Error("You need to be logged in to request an edit");
  }
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
  await db.notification.create({
    data: {
      title: "Edit request accepted",
      message: "Your edit request has been accepted",
      type: "ACCEPT_REQUEST_EDIT",
      senderProjectRole: "CREATOR",
      projectId,
      fromUserId: userId,
      toUserId: editorId
    }
  });
};

export const USDtoETH = async (USD: number) => {
  const { data : { result : { ethusd } } } = await axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_API_KEY}`);
  const answer = USD / ethusd;
  return parseFloat(answer.toString()).toFixed(18);
}

export const ETHtoUSD = async (ETH: number) => {
  const { data : { result : { ethusd } } } = await axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_API_KEY}`);
  const answer = ETH * ethusd;
  return parseFloat(answer.toString()).toFixed(2);
}