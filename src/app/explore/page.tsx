import { getAllProjects } from "@/actions/project";
import { auth } from "@/auth";
import { ExploreProjects } from "@/Components/MyComponents/Client/ExploreProjects";
import { Footer } from "@/Components/MyComponents/General/Footer";
import { UserNavbar } from "@/Components/MyComponents/General/UserNavbar";
import { db } from "@/lib/db";
import { ProjectType } from "@prisma/client";

const demoInitialProjects = [
  {
    id: "1",
    creator: {
      id: "1",
      name: "John Doe",
      profilePicture: null,
      youtubeRefreshToken: null,
    },
    title: "Project 1",
    description: "Description 1",
    type: 'COMMERCIAL' as ProjectType,
    duration: 5,
    deadline: new Date(),
    _count: {
      requests: 0,
      compulsoryInstructions: 0,
      optionalInstructions: 0,
    },
    updatedAt: new Date(),
  },
  {
    id: "2",
    creator: {
      id: "2",
      name: "Jane Doe",
      profilePicture: null,
      youtubeRefreshToken: null,
    },
    title: "Project 2",
    description: "Description 2",
    type: 'DOCUMENTARY' as ProjectType,
    duration: 10,
    deadline: new Date(),
    _count: {
      requests: 0,
      compulsoryInstructions: 0,
      optionalInstructions: 0,
    },
    updatedAt: new Date(),
  },
  {
    id: "3",
    creator: {
      id: "3",
      name: "Jack Doe",
      profilePicture: null,
      youtubeRefreshToken: null,
    },
    title: "Project 3",
    description: "Description 3",
    type: 'MUSIC_VIDEO' as ProjectType,
    duration: 15,
    deadline: new Date(),
    _count: {
      requests: 0,
      compulsoryInstructions: 0,
      optionalInstructions: 0,
    },
    updatedAt: new Date(),
  },
  {
    id: "4",
    creator: {
      id: "4",
      name: "Jill Doe",
      profilePicture: null,
      youtubeRefreshToken: null,
    },
    title: "Project 4",
    description: "Description 4",
    type: 'SHORT_FILM' as ProjectType,
    duration: 20,
    deadline: new Date(),
    _count: {
      requests: 0,
      compulsoryInstructions: 0,
      optionalInstructions: 0,
    },
    updatedAt: new Date(),
  },
  {
    id: "5",
    creator: {
      id: "5",
      name: "Jim Doe",
      profilePicture: null,
      youtubeRefreshToken: null,
    },
    title: "Project 5",
    description: "Description 5",
    type: 'VLOG' as ProjectType,
    duration: 25,
    deadline: new Date(),
    _count: {
      requests: 0,
      compulsoryInstructions: 0,
      optionalInstructions: 0,
    },
    updatedAt: new Date(),
  },
  {
    id: "6",
    creator: {
      id: "6",
      name: "Jenny Doe",
      profilePicture: null,
      youtubeRefreshToken: null,
    },
    title: "Project 6",
    description: "Description 6",
    type: "COMMERCIAL" as ProjectType,
    duration: 30,
    deadline: new Date(),
    _count: {
      requests: 0,
      compulsoryInstructions: 0,
      optionalInstructions: 0,
    },
    updatedAt: new Date(),
  }
];

const ExplorePage = async () => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const user = await db.user.findUnique({
    where: {
      id: session.user.id
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const { readyToEdit } = user;
  const initialProjects = await getAllProjects();
  // const initialProjects = demoInitialProjects;
  return (
    <div className="flex flex-col justify-between items-center gap-4 w-lvw min-h-lvh">
      <UserNavbar/>
      <div className="w-lvw p-8 flex-grow flex flex-col gap-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Explore Projects</h2>
          <p className="text-lg text-gray-500">
            Explore projects created by other users. You can request to work on a project, or create your own project.
          </p>
        </div>
        <ExploreProjects initialProjects={initialProjects} readyToEdit={readyToEdit}/>
      </div>
      <Footer/>
    </div>
  );
}

export default ExplorePage;