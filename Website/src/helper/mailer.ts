"use server"

import { FORGOT_PASSWORD_EMAIL, forgotPasswordEmailContent, forgotPasswordEmailSubject, VERIFICATION_EMAIL, verificationEmailContent, verificationEmailSubject, websiteName } from "@/constants";
import nodemailer from "nodemailer"
import { env } from "process"
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"

const {
  GOOGLE_GMAIL_USER,
  GOOGLE_APP_PASSWORD
} = env;

export const sendEmail = async (email: string, emailType: string) => {
    try {
      const userToken = await bcrypt.hash(email, 10);
      if (emailType === VERIFICATION_EMAIL) {
        await db.user.update({
          where: { email },
          data: {
            emailVerificationToken: userToken,
            emailVerificationTokenExpires: new Date(Date.now() + 172800000)
          }
        });
      } else if (emailType === FORGOT_PASSWORD_EMAIL) {
        await db.user.update({
          where: { email },
          data: {
            passwordResetToken: userToken,
            passwordResetTokenExpires: new Date(Date.now() + 3600000)
          }
        });
      }
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GOOGLE_GMAIL_USER,
          pass: GOOGLE_APP_PASSWORD
        }
      });
      const userName = await db.user.findUnique({
        where: { email },
        select: { name: true }
      });
      if (!userName) {
        throw new Error("User not found");
      }
      const { name } = userName;
      const mailOptions = {
        to: email,
        subject: emailType == VERIFICATION_EMAIL ? verificationEmailSubject : emailType == FORGOT_PASSWORD_EMAIL ? forgotPasswordEmailSubject : `Mail From ${websiteName}`,
        html: emailType == VERIFICATION_EMAIL ? verificationEmailContent(name, userToken) : emailType == FORGOT_PASSWORD_EMAIL ? forgotPasswordEmailContent(name, userToken) : `Mail From ${websiteName}`
      };
      const mailResponse = await transporter.sendMail(mailOptions);
      return mailResponse;
    } catch (error : any) {
      throw new Error(error);
    }
}