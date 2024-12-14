import { sendEmail } from "@/helper/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("send-email");
  try {
    const { email, emailType } = await req.json();
    await sendEmail(email, emailType);
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error : any) {
    console.log("Error sending email");
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}