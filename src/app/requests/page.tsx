import { getRequestEditors } from "@/actions/requestEditor";
import { EditorRequests } from "@/Components/MyComponents/Client/EditorRequests";
import { Footer } from "@/Components/MyComponents/General/Footer";
import { UserNavbar } from "@/Components/MyComponents/General/UserNavbar";
import { Card, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";

import { ProjectType, RequestStatus } from "@prisma/client";

const demoRequests = [
  {
    project: {
      title: "Project Title",
      id: "1",
      type: ProjectType.MUSIC_VIDEO,
      duration: 30,
      creator: {
        name: "Creator Name",
        profilePicture: "https://randomuser.me/api/port/",
        _count: {
          createdProjects: 10,
        },
        username: "username",
      },
      deadline: new Date(),
    },
    createdAt: new Date(),
    status: RequestStatus.PENDING,
  },
  {
    project: {
      title: "Project Title",
      id: "1",
      type: ProjectType.VLOG,
      duration: 30,
      creator: {
        name: "Creator Name",
        profilePicture: "https://randomuser.me/api/port/",
        _count: {
          createdProjects: 10,
        },
        username: "username",
      },
      deadline: new Date(),
    },
    createdAt: new Date(),
    status: RequestStatus.PENDING,
  },
  {
    project: {
      title: "Project Title",
      id: "1",
      type: ProjectType.DOCUMENTARY,
      duration: 30,
      creator: {
        name: "Creator Name",
        profilePicture: "https://randomuser.me/api/port/",
        _count: {
          createdProjects: 10,
        },
        username: "username",
      },
      deadline: new Date(),
    },
    createdAt: new Date(),
    status: RequestStatus.PENDING,
  }
];

const RequestsPage = async () => {
  // const requests = await getRequestEditors();
  const requests = demoRequests;
  return (
    <div className="w-lvw h-lvh flex flex-col gap-4 justify-between items-center">
      <UserNavbar/>
      <Card className="w-4/5 flex flex-col gap-4 justify-start items-start border-none shadow-none">
        <CardHeader>
          <CardTitle>Project Requests</CardTitle>
          <CardDescription>
            Manage your project requests from creators who want you to edit their projects.
          </CardDescription>
        </CardHeader>
        <EditorRequests initialRequests={requests}/>
      </Card>
      <Footer/>
    </div>
  )
};

export default RequestsPage;