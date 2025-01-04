import { getProject } from "@/actions/project";
import { auth } from "@/auth";
import { Collaboration } from "@/Components/MyComponents/Client/Collaboration";
import { websiteName } from "@/constants";

interface CollaborationPageProps {
  params: { id: string };
  searchParams: { [key: string]: string };
}

export const generateMetadata = async (params: CollaborationPageProps) => {
  const { title, description } = await getProject(params.params.id);
  return {
    title: `Collaboration - ${title} | Project | ${websiteName}`,
    description: `Collaboration page for project ${title}. ${description}`,
  };
}

const CollaborationPage: React.FC<CollaborationPageProps> = async ({ params, searchParams }) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const projectId = await params.id;
  const fileVersion = searchParams["fileVersion"];
  const thumbnailVersion = searchParams["thumbnailVersion"];
  const { title, FileVersion, ThumbnailVersion, creator } = await getProject(projectId);
  const isCreator = creator.id === session.user.id;
  return (
    <Collaboration
      project={{
        title,
        creator: {
          name: creator.name,
          profilePicture: creator.profilePicture,
        },
        fileVersion : FileVersion,
        thumbnailVersion: ThumbnailVersion,
      }}
      fileVersion={fileVersion} thumbnailVersion={thumbnailVersion}
      isCreator={isCreator}
    />
  );
};

export default CollaborationPage;