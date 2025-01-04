import { getUser } from "@/actions/user";
import { auth } from "@/auth";
import { EditProfileForm } from "@/Components/MyComponents/Forms/EditProfileForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { websiteName } from "@/constants";

interface EditProfilePageProps {
  params: {
    username: string;
  };
}

export const generateMetadata = async ({ params } : EditProfilePageProps) => {
  const { username } = params;
  return {
    title: `${username} | Edit Profile | ${websiteName}`,
    description: `Edit your profile information on Creator Sync`,
  }
};

const EditProfilePage : React.FC<EditProfilePageProps> = async ({ params }) => {
  const username = await decodeURIComponent(params.username);
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  if (session.user.username !== username) {
    throw new Error("Unauthorized");
  }
  const demoUser = {
    profilePicture: "https://randomuser.me/api/portraits/m",
    name: "Demo User",
    username: "demo-user",
    bio: "I'm a demo user",
    location: "Demo City, Demo Country",
    email: "johndoe@gmail.com",
    website: "https://johndoe.com",
    youtubeLink: "https://youtube.com/johndoe",
    xLink: "https://twitter.com/johndoe",
    instagramLink: "https://instagram.com/johndoe",
    skills: ["Skill 1", "Skill 2", "Skill 3"],
  }
  const user = await getUser(username);
  // const user = demoUser;
  if (!user) {
    throw new Error("User not found");
  }
  return (
    <Card className="w-3/5">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Edit your profile information below
        </CardDescription>
      </CardHeader>
      <EditProfileForm user={user} />
    </Card>
  );
}

export default EditProfilePage;