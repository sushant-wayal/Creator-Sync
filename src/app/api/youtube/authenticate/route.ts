import { oauth2Client } from "@/helper/youtube";
import { NextResponse } from "next/server";

export async function GET() {
  const scopes = [
    `https://www.googleapis.com/auth/youtube.upload`,
    `https://www.googleapis.com/auth/youtube.readonly`
  ];
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  return NextResponse.json({ authUrl }, { status: 200 });
}