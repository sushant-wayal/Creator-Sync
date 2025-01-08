import { oauth2Client, youtube } from "@/helper/youtube";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    console.log("refreshToken", refreshToken);
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
  } catch (error) {
    console.log("Error error error !!!!")
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 200 });
    } else {
      console.error("Unknown error", error);
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 200 });
    }
  }
}