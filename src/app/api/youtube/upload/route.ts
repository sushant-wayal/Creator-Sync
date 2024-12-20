import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { oauth2Client, youtube } from '@/helper/youtube';
import { db } from "@/lib/db";

export const config = {
  api: {
    bodyParser: false
  }
}

export async function POST(req: NextRequest) {
  const { refreshToken, projectId } = await req.json();
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      title: true,
      description: true,
      FileVersion: {
        orderBy: {
          version: 'desc',
        },
        take: 1,
        select: {
          url: true,
        }
      },
      ThumbnailVersion: {
        orderBy: {
          version: 'desc',
        },
        take: 1,
        select: {
          url: true,
        }
      }
    },
  });
  const { title, description, FileVersion, ThumbnailVersion } = project || {};
  const videoUrl = FileVersion?.[0]?.url;
  const thumbnailUrl = ThumbnailVersion?.[0]?.url;
  console.log("req",{ refreshToken, title, description, videoUrl, thumbnailUrl });
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials : { access_token } } = await oauth2Client.refreshAccessToken();
  oauth2Client.setCredentials({ access_token });
  const response = await axios({
    url: videoUrl,
    method: 'GET',
    responseType: 'stream',
  });
  const tempFilePath = path.join(process.cwd(), 'temp_video.mp4');
  const writer = fs.createWriteStream(tempFilePath);
  await new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
  const videoStream = fs.createReadStream(tempFilePath);
  const youtubeResponse = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title,
        description,
      },
      status: {
        privacyStatus: 'public', // Change to 'public' or 'unlisted' as needed
      },
    },
    media: {
      body: videoStream,
    },
  });
  console.log("youtubeResponse", youtubeResponse);
  const videoId = youtubeResponse.data.id;
  if (thumbnailUrl) {
    const thumbnailResponse = await axios({
      url: thumbnailUrl,
      method: 'GET',
      responseType: 'stream',
    });
    const tempThumbnailPath = path.join(process.cwd(), 'temp_thumbnail.jpg');
    const thumbnailWriter = fs.createWriteStream(tempThumbnailPath);
    await new Promise((resolve, reject) => {
      thumbnailResponse.data.pipe(thumbnailWriter);
      thumbnailWriter.on('finish', resolve);
      thumbnailWriter.on('error', reject);
    });
    const thumbnailStream = fs.createReadStream(tempThumbnailPath);
    if (typeof videoId === 'string') {
      await youtube.thumbnails.set({
        videoId,
        media: {
          body: thumbnailStream,
        },
      });
    } else {
      throw new Error('Invalid videoId');
    }
    fs.unlinkSync(tempThumbnailPath);
  }
  fs.unlinkSync(tempFilePath);
  await db.project.update({
    where: { id: projectId },
    data: {
      completed: true,
    },
  });
  return NextResponse.json({ data: youtubeResponse.data }, { status: 200 });
}