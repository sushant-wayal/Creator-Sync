import { getUser } from "@/actions/user";
import { auth } from "@/auth";
import { Footer } from "@/Components/MyComponents/General/Footer";
import { UserNavbar } from "@/Components/MyComponents/General/UserNavbar";
import { ProfilePicture } from "@/Components/MyComponents/General/ProfilePicture";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Award, Calendar, FileVideo, Globe, Instagram, Mail, MapPin, SquarePlay, Twitter, Users, Youtube } from "lucide-react";
import Link from "next/link";
import { urlencoded } from "express";
import axios from "axios";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { domain } from "@/constants";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export const demoUser = {
  id: 1,
  name: "John Doe",
  username: "johndoe",
  profilePicture: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200",
  email: "johndoe@gmai.com",
  rating: 4.5,
  createdAt: new Date(),
  skills: ["Skill 1", "Skill 2", "Skill 3"],
  readyToEdit: false,
  bio: "I'm a demo user",
  location: "Demo City, Demo Country",
  website: "https://johndoe.com",
  youtubeLink: "https://youtube.com/johndoe",
  instagramLink: "https://instagram.com/johndoe",
  xLink: "https://x.com/johndoe",
  youtubeRefreshToken: "youtubeRefreshToken",
  createdProjects: [
    {
      id: 1,
      title: "Project 1",
      type: "Type 1",
      creatorId: 1,
      editorId: 2,
      completed: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      deadline: new Date(),
      Instructions: [
        {
          status: "COMPLETED"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "COMPLETED"
        },
        {
          status: "COMPLETED"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "COMPLETED"
        },
      ]
    },
    {
      id: 3,
      title: "Project 3",
      type: "Type 3",
      creatorId: 1,
      editorId: 3,
      completed: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      deadline: new Date(),
      Instructions: [
        {
          status: "COMPLETED"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "COMPLETED"
        },
        {
          status: "COMPLETED"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "COMPLETED"
        },
      ]
    },
    {
      id: 4,
      title: "Project 4",
      type: "Type 4",
      creatorId: 1,
      editorId: 4,
      completed: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      deadline: new Date(),
      Instructions: [
        {
          status: "COMPLETED"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "COMPLETED"
        },
        {
          status: "COMPLETED"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "COMPLETED"
        },
      ]
    }
  ],
  editedProjects: [
    {
      id: 2,
      title: "Project 2",
      type: "Type 2",
      creatorId: 2,
      editorId: 1,
      completed: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      deadline: new Date(),
      Instructions: [
        {
          status: "In Progress"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "COMPLETED"
        },
        {
          status: "COMPLETED"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "COMPLETED"
        },
      ]
    },
    {
      id: 5,
      title: "Project 5",
      type: "Type 5",
      creatorId: 3,
      editorId: 1,
      completed: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      deadline: new Date(),
      Instructions: [
        {
          status: "In Progress"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "COMPLETED"
        },
        {
          status: "COMPLETED"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "COMPLETED"
        },
      ]
    },
    {
      id: 6,
      title: "Project 6",
      type: "Type 6",
      creatorId: 4,
      editorId: 1,
      completed: false,
      updatedAt: new Date(),
      createdAt: new Date(),
      deadline: new Date(),
      Instructions: [
        {
          status: "In Progress"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "COMPLETED"
        },
        {
          status: "COMPLETED"
        },
        {
          status: "PENDING"
        },
        {
          status: "PENDING"
        },
        {
          status: "COMPLETED"
        },
      ]
    }
  ]
}

const demoChannelData = {
  title: "John Doe",
  subscribers: 1000,
  views: 10000,
  videos: 100
}

const ProfilePage : React.FC<ProfilePageProps> = async ({ params }) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  // const { username } = params;
  const username = await decodeURIComponent(params.username);
  const activeUser = username === session.user.username;
  const user = await getUser(username);
  if (!user) {
    throw new Error("User not found");
  }
  let userChannelData;
  if (user.youtubeRefreshToken) {
    const { data: { channelData } } = await axios.post(`${domain}/api/youtube/statistics`, { refreshToken: user.youtubeRefreshToken });
    userChannelData = channelData;
  }
  const { title, subscribers, views, videos } = userChannelData || demoChannelData;
  // const { title, subscribers, views, videos } = demoChannelData;
  let youtubeAuthUrl = "";
  if (activeUser && !user.youtubeRefreshToken) {
    const { data: { authUrl } } = await axios.get(`${domain}/api/youtube/authenticate`);
    youtubeAuthUrl = authUrl;
  }
  // const user = demoUser;
  const noOfCompletedProjects = user.createdProjects.filter(({ completed }) => completed).length + user.editedProjects.filter(({ completed }) => completed).length;
  const noOfActiveProjects = user.createdProjects.filter(({ completed }) => !completed).length + user.editedProjects.filter(({ completed }) => !completed).length;
  const noOfCollaborations = (new Set([...user.createdProjects.map(({ editorId }) => editorId), ...user.editedProjects.map(({ creatorId }) => creatorId)])).size;
  const createdProjectStatuses = user.createdProjects.map(({ Instructions, completed }) => {
    const completedInstructions = Instructions.filter(({ status }) => status === "COMPLETED").length;
    const totalInstructions = Instructions.length;
    if (completed) {
      return "Completed";
    } else if (completedInstructions === 0) {
      return "Just Started";
    } else if (completedInstructions === totalInstructions) {
      return "Final Review";
    } else {
      return "In Progress";
    }
  })
  const editedProjectStatuses = user.editedProjects.map(({ Instructions, completed }) => {
    const completedInstructions = Instructions.filter(({ status }) => status === "COMPLETED").length;
    const totalInstructions = Instructions.length;
    if (completed) {
      return "Completed";
    } else if (completedInstructions === 0) {
      return "Just Started";
    } else if (completedInstructions === totalInstructions) {
      return "Final Review";
    } else {
      return "In Progress";
    }
  });
  return (
    <div className="flex flex-col justify-between items-center gap-4 w-lvw min-h-lvh">
      <UserNavbar/>
      <div className="flex justify-start items-start gap-4 w-5/6">
        <div className="w-1/3 flex flex-col justify-start items-center gap-4">
          <div className="w-full rounded-xl border-[1px] border-gray-300 p-8">
            <div className="w-full flex flex-col justify-center items-center gap-3">
              <ProfilePicture url={user.profilePicture} name={user.name} className="h-20 w-20"/>
              <h2 className="text-2xl font-bold text-black">{user.name}</h2>
              <h3 className="text-lg text-gray-500">{user.username}</h3>
              {activeUser && (
                <Link href={`/profile/${username}/edit`}><Button>Edit Profile</Button></Link>
              )}
            </div>
            <hr className="w-full border-1 border-gray-200 my-5"/>
            <div className="w-full flex flex-col justify-center items-start gap-3">
              <div className="w-full flex justify-start items-center gap-3">
                <MapPin color="gray" size={18} />
                <h3>{user.location}</h3>
              </div>
              <div className="w-full flex justify-start items-center gap-3">
                <Mail color="gray" size={18} />
                <h3>{user.email}</h3>
              </div>
              <div className="w-full flex justify-start items-center gap-3">
                <Globe color="gray" size={18} />
                <h3>{user.website}</h3>
              </div>
              <div className="w-full flex justify-start items-center gap-3">
                <Calendar color="gray" size={18} />
                <h3>Joined {user.createdAt.toLocaleDateString()}</h3>
              </div>
            </div>
            {(user.youtubeRefreshToken || activeUser) && <hr className="w-full border-1 border-gray-200 my-5"/>}
            {user.youtubeRefreshToken ? (
              <div className="w-full h-auto space-y-5 border-[1px] border-gray-300 p-6 rounded-xl">
                <div className="w-full flex justify-between items-start">
                  <div className="flex flex-col justify-center items-start gap-1">
                    <div className="flex justify-center items-center gap-3">
                      <Youtube color="red"/>
                      <h3 className="font-bold">YouTube Channel</h3>
                    </div>
                    <p className="text-gray-500">{title}</p>
                  </div>
                  <div className="flex justify-center items-center px-2 py-px rounded-full border-[1px] gap-2 border-gray-300">
                    <div
                      className="h-3 aspect-square rounded-full bg-green-500"
                    ></div>
                    <p className="text-sm">Connected</p>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="flex flex-col justify-center items-center">
                    <Users color="gray" size={18} />
                    <p className="font-semibold">{subscribers}</p>
                    <p className="text-gray-500 text-sm">Subscribers</p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <SquarePlay color="gray" size={18} />
                    <p className="font-semibold">{videos}</p>
                    <p className="text-gray-500 text-sm">Videos</p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <Award color="gray" size={18} />
                    <p className="font-semibold">{views}</p>
                    <p className="text-gray-500 text-sm">Views</p>
                  </div>
                </div>
              </div>
            ) : activeUser ? (
              <Suspense fallback={<p>Loading...</p>}>
                <Link href={youtubeAuthUrl}>
                  <Button
                    className="w-full flex justify-center items-center p-0"
                    variant="outline"
                  >
                    <Youtube color="red"/>
                    <p>Connect to YouTube</p>
                  </Button>
                </Link>
              </Suspense>
            ) : null}
            <hr className="w-full border-1 border-gray-200 my-5"/>
            <div className="w-full flex justify-between items-center">
              <Link href={user.youtubeLink || ""}><Youtube color="gray" size={22} /></Link>
              <Link href={user.xLink || ""}><Twitter color="gray" size={20} /></Link>
              <Link href={user.instagramLink || ""}><Instagram color="gray" size={20} /></Link>
            </div>
          </div>
          {user.skills.length > 0 &&
            <div className="w-full rounded-xl border-[1px] border-gray-300 p-8">
              <h2 className="text-2xl font-bold text-black mb-5">Skills & Expertise</h2>
              <div className="w-full">
                {user.skills.map((skill, index) => (
                  <Badge variant="secondary" className="inline mr-2 font-bold" key={index}>{skill}</Badge>
                ))}
              </div>
            </div>
          }
        </div>
        <div className="w-2/3 flex flex-col justify-start items-start gap-4">
          {user.bio &&
            <div className="w-full rounded-xl border-[1px] border-gray-300 p-8">
            <p className="text-2xl font-bold text-black mb-5">About</p>
              <p className="text-gray-500">
                {user.bio}
              </p>
            </div>
          }
          <div className="w-full rounded-xl border-[1px] border-gray-300 p-8">
            <p className="text-2xl font-bold text-black mb-5">Statistics</p>
            <div className="w-full grid grid-cols-4 gap-4">
              <div className="flex flex-col justify-center items-start gap-2">
                <h3 className="text-3xl font-bold text-black">{noOfCompletedProjects}</h3>
                <h4 className="text-sm text-gray-500">Projects Completed</h4>
              </div>
              <div className="flex flex-col justify-center items-start gap-2">
                <h3 className="text-3xl font-bold text-black">{noOfActiveProjects}</h3>
                <h4 className="text-sm text-gray-500">Active Projects</h4>
              </div>
              <div className="flex flex-col justify-center items-start gap-2">
                <h3 className="text-3xl font-bold text-black">{noOfCollaborations}</h3>
                <h4 className="text-sm text-gray-500">Collaborations</h4>
              </div>
              <div className="flex flex-col justify-center items-start gap-2">
                <h3 className="text-3xl font-bold text-black">{user.rating}</h3>
                <h4 className="text-sm text-gray-500">Average Rating</h4>
              </div>
            </div>
          </div>
          <div className="w-full rounded-xl border-[1px] border-gray-300 p-8">
            <p className="text-2xl font-bold text-black mb-5">Projects</p>
            <Tabs defaultValue={user.readyToEdit ? "edited" : "created"}>
              <TabsList className="w-1/3">
                {user.readyToEdit ?
                  <>
                    <TabsTrigger className="text-center w-1/2" value="edited">Edited</TabsTrigger>
                    <TabsTrigger className="text-center w-1/2" value="created">Created</TabsTrigger>
                  </>
                  :
                  <>
                    <TabsTrigger className="text-center w-full" value="created">Created</TabsTrigger>
                    <TabsTrigger className="text-center w-full" value="edited">Edited</TabsTrigger>
                  </>
                }
              </TabsList>
              <TabsContent value="created" className="w-full flex flex-col items-start justify-start gap-4">
                {user.createdProjects.map(({ id, title, type }, index) => (
                  <div className="w-full rounded-xl bg-gray-100 p-4 flex justify-between items-center" key={index}>
                    <div className="flex justify-center items-center gap-4">
                      <FileVideo color="black" size={32} />
                      <div className="flex flex-col justify-center items-start gap-px">
                        <p className="text-lg font-semibold text-black">{title}</p>
                        <p className="text-sm font-light text-gray-500">{type}</p>
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      <Badge variant={createdProjectStatuses[index] == "Completed" ? "default" : "secondary"} className="font-bold">{createdProjectStatuses[index]}</Badge>
                      <Link href={`/project/${id}`}><Button className="p-2 h-auto">View</Button></Link>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="edited" className="w-full flex flex-col items-start justify-start gap-4">
                {user.editedProjects.map(({ id, title, type }, index) => (
                  <div className="w-full rounded-xl bg-gray-100 p-4 flex justify-between items-center" key={index}>
                    <div className="flex justify-center items-center gap-4">
                      <FileVideo color="black" size={32} />
                      <div className="flex flex-col justify-center items-start gap-px">
                        <p className="text-lg font-semibold text-black">{title}</p>
                        <p className="text-sm font-light text-gray-500">{type}</p>
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      <Badge variant={editedProjectStatuses[index] == "Completed" ? "default" : "secondary"} className="font-bold">{editedProjectStatuses[index]}</Badge>
                      <Link href={`/project/${id}`}><Button className="p-2 h-auto">View</Button></Link>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProfilePage;