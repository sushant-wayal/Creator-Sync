import { oauth2Client, youtube } from "@/helper/youtube";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials : { access_token } } = await oauth2Client.refreshAccessToken();
  oauth2Client.setCredentials({ access_token });
  const response = await youtube.channels.list({
    part: ['snippet', 'statistics'],
    mine: true,
  });
  const channel = response.data.items ? response.data.items[0] : null;
  const channelData = {
    title: channel?.snippet?.title,
    subscribers: channel?.statistics?.subscriberCount,
    views: channel?.statistics?.viewCount,
    videos: channel?.statistics?.videoCount,
  }

  return NextResponse.json({ channelData }, { status: 200 });
}