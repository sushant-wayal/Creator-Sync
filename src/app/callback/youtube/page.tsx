import { updateYoutubeRefreshToken } from "@/actions/user";
import { auth } from "@/auth";
import { oauth2Client } from "@/helper/youtube";
import { redirect } from "next/navigation";

const CallbackPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const code = searchParams['code'];
  if (!code) {
    throw new Error("Authorization code is null");
  }
  const { tokens : { refresh_token } } = await oauth2Client.getToken(code);
  console.log("refresh_token", refresh_token);
  if (!refresh_token) {
    throw new Error("Refresh token is null");
  }
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    throw new Error("User ID is null");
  }
  await updateYoutubeRefreshToken(userId, refresh_token);
  redirect(`/profile/${session.user.username}`);
}

export default CallbackPage;