import { domain } from '@/constants';
import { google } from 'googleapis';

export const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  `${domain}/callback/youtube`
);

export const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});