"use server"

import { db } from "@/lib/db";
import { hash } from "bcryptjs";

export const verifyEmail = async (email : string, token : string) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, emailVerificationToken: true, emailVerificationTokenExpires: true }
  });
  if (!user) {
    return { error: "User not found" };
  }
  const { emailVerificationToken, emailVerificationTokenExpires } = user;
  if (emailVerificationToken !== token) {
    return { error: "False attempt detected" };
  }
  if (!emailVerificationTokenExpires || new Date(emailVerificationTokenExpires) < new Date()) {
    return { error: "Verification Link Expired" };
  }
  await db.user.update({
    where: { email },
    data: {
      emailVerified: true,
      emailVerificationTokenExpires: new Date()
    }
  });
  await db.notification.create({
    data: {
      title: "Email Verified",
      message: "Your email has been verified successfully",
      type: "EMAIL_VERIFICATION",
      senderProjectRole: "SYSTEM",
      toUserId: user.id
    }
  });
  return true;
}

export const resetPassword = async (email : string, password : string, token : string) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, passwordResetToken: true, passwordResetTokenExpires: true }
  });
  if (!user) {
    return { error: "User not found" };
  }
  const { passwordResetToken, passwordResetTokenExpires } = user;
  if (passwordResetToken !== token) {
    return { error: "False attempt detected" };
  }
  if (!passwordResetTokenExpires || new Date(passwordResetTokenExpires) < new Date()) {
    return { error: "Password Reset Link Expired" };
  }
  const hashedPassword = await hash(password, 10);
  await db.user.update({
    where: { email },
    data: {
      password : hashedPassword,
      passwordResetTokenExpires: new Date()
    }
  });
  await db.notification.create({
    data: {
      title: "Password Reset",
      message: "Your password has been reset successfully",
      type: "PASSWORD_RESET",
      senderProjectRole: "SYSTEM",
      toUserId: user.id
    }
  });
  return true;
}