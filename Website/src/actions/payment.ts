"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PaymentStatus, PaymentType } from "@prisma/client";
import { USDtoETH } from "./requestEdit";

export const createPayment = async (projectId: string, budgetInEth: number, type: PaymentType, status: PaymentStatus = PaymentStatus.PENDING, penalty: number = 0) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not logged in");
  }
  const { id } = await db.payment.create({
    data: {
      amount: budgetInEth,
      userId: session.user.id,
      projectId: projectId,
      type: type,
      status,
      penalty
    }
  });
  return id;
}

export const updateStatus = async (paymentId: string, status: PaymentStatus) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not logged in");
  }
  await db.payment.update({
    where: {
      id: paymentId
    },
    data: {
      status
    }
  });
}

export const createCompleteTypePayment = async (projectId: string, amount: number, refund: number) => {
  console.log("createCompleteTypePayment", projectId, amount, refund);
  const amountInEth = await USDtoETH(amount);
  const refundInEth = await USDtoETH(refund);
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not logged in");
  }
  const userId = session.user.id;
  const project = await db.project.findUnique({
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
  const { creatorId, editorId } = project;
  if (userId !== creatorId && userId !== editorId) return;
  const payment = await db.payment.findFirst({
    where: {
      projectId: projectId,
      type: PaymentType.COMPLETE,
      userId: userId
    }
  });
  if (payment) return;
  if (userId === creatorId && refund > 0) await createPayment(projectId, Number(refundInEth), PaymentType.COMPLETE, PaymentStatus.COMPLETED);
  else if (userId === editorId && amount > 0) await createPayment(projectId, Number(amountInEth), PaymentType.COMPLETE, PaymentStatus.COMPLETED, refund);
}

export const getPayments = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not logged in");
  }
  const payments = await db.payment.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      project: {
        select: {
          title: true
        }
      },
      user: {
        select: {
          accountAddress: true
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });
  return payments;
}