import { getProject } from "@/actions/project"
import { auth } from "@/auth"
import { ExtendDeadlineForm } from "@/Components/MyComponents/Forms/ExtendDeadlineForm"
import { RequestrevisionForm } from "@/Components/MyComponents/Forms/RequestRevisionForm"
import { UploadNewVersionForm } from "@/Components/MyComponents/Forms/UploadNewVersionForm"
import { Footer } from "@/Components/MyComponents/General/Footer"
import { UserNavbar } from "@/Components/MyComponents/General/UserNavbar"
import { ProfilePicture } from "@/Components/MyComponents/General/ProfilePicture"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog"
import { Progress } from "@/Components/ui/progress"
import { CheckCircle, Clock, Download, Eye, FileVideo, MessageSquare } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import Image from "next/image"
import { UploadThumbnail } from "@/Components/MyComponents/Client/UploadThumbnail"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/Components/ui/hover-card"
import { ApproveUploadButton } from "@/Components/MyComponents/Client/ApproveUploadButton"
import { db } from "@/lib/db"
import { RequestEditButton } from "@/Components/MyComponents/Client/RequestEditButton"
import { EditRequests } from "@/Components/MyComponents/Client/EditRequests"
import { RequestEditorDialog } from "@/Components/MyComponents/Client/RequestEditorDialog"
import { getEditorsToRequest } from "@/actions/editor"
import { EditorRating } from "@/Components/MyComponents/Client/EditorRating"
import { markAllOfProjectAsRead } from "@/actions/notification"

interface ProjectPageProps {
  params: {
    id: string
  }
}

const ProjectPage : React.FC<ProjectPageProps> = async ({ params }) => {
  const { id } = params
  const session = await auth();
  if (!session || !session.user) redirect("/signin");
  const demoProject = {
    title: "Demo Project",
    description: "This is a demo project",
    type: "Demo",
    duration: "1 week",
    deadline: new Date(),
    Instructions: [
      {
        id: "1",
        content: "This is a demo instruction",
        nature: "COMPULSORY" as "COMPULSORY" | "OPTIONAL",
        status: "PENDING"
      },
      {
        id: "2",
        content: "This is a demo instruction",
        nature: "OPTIONAL" as "COMPULSORY" | "OPTIONAL",
        status: "PENDING"
      },
      {
        id: "3",
        content: "This is a demo instruction",
        nature: "COMPULSORY" as "COMPULSORY" | "OPTIONAL",
        status: "COMPLETED"
      },
      {
        id: "4",
        content: "This is a demo instruction",
        nature: "OPTIONAL" as "COMPULSORY" | "OPTIONAL",
        status: "PENDING"
      },
    ],
    FileVersion: [
      {
        id: "1",
        url: "https://example.com",
        name: "demo-file",
        version: 0,
        createdAt: new Date()
      },
      {
        id: "2",
        url: "https://example.com",
        name: "demo-file",
        version: 1,
        createdAt: new Date()
      },
      {
        id: "3",
        url: "https://example.com",
        name: "demo-file",
        version: 2,
        createdAt: new Date()
      },
      {
        id: "4",
        url: "https://example.com",
        name: "demo-file",
        version: 3,
        createdAt: new Date()
      }
    ],
    ThumbnailVersion: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1719937051058-63705ed35502?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "demo-thumbnail",
        version: 0,
        createdAt: new Date()
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1730326405863-c6fa7e499a6e?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "demo-thumbnail",
        version: 1,
        createdAt: new Date()
      },
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1730247147351-6db1dc7b2dbc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "demo-thumbnail",
        version: 2,
        createdAt: new Date()
      },
      {
        id: "4",
        url: "https://images.unsplash.com/photo-1730941343980-5d81ce7c768b?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "demo-thumbnail",
        version: 3,
        createdAt: new Date()
      }
    ],
    isCreator: true,
    completed: false,
    creator: {
      id: "1",
      name: "Demo Creator",
      profilePicture: "https://example.com",
      _count: {
        createdProjects: 1
      }
    },
    // editor: {
    //   id: "2",
    //   name: "Demo Editor",
    //   profilePicture: "https://example.com",
    //   rating: 4.5
    // },
    createdAt: new Date(),
    requests: [
      {
        id: "1",
        createdAt: new Date(),
        editor: {
          id: "2",
          name: "Demo Editor",
          profilePicture: "https://example.com",
          rating: 4.5,
          skills: ["Demo Skill"],
          _count: {
            editedProjects: 10
          }
        }
      },
      {
        id: "2",
        createdAt: new Date(),
        editor: {
          id: "3",
          name: "Demo Editor",
          profilePicture: "https://example.com",
          rating: 4.5,
          skills: ["Demo Skill"],
          _count: {
            editedProjects: 10
          }
        }
      },
      {
        id: "3",
        createdAt: new Date(),
        editor: {
          id: "4",
          name: "Demo Editor",
          profilePicture: "https://example.com",
          rating: 4.5,
          skills: ["Demo Skill"],
          _count: {
            editedProjects: 10
          }
        }
      }
    ]
  }
  const { title, description, type, duration, deadline, Instructions, FileVersion, ThumbnailVersion, isCreator, completed, creator, editor, createdAt, requests } = await getProject(id);
  // const { title, description, type, duration, deadline, Instructions, FileVersion, ThumbnailVersion, isCreator, completed, creator, editor, createdAt, requests } = demoProject;
  // if (editor && session.user.id != creator.id && session.user.id != editor.id) throw new Error("You are not authorized to view this project");
  const totalInstructions = Instructions.length;
  const completedInstructions = Instructions.filter((instruction) => instruction.status === "COMPLETED").length;
  const status = completed ? "Completed" : completedInstructions === 0 ? "Just Started" : completedInstructions === totalInstructions ? "Final Review" : "In Progress";
  const progress = completed ? 100 : ((completedInstructions + 1) / (totalInstructions + 2)) * 100;
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      youtubeRefreshToken: true
    }
  });
  const refreshToken = user?.youtubeRefreshToken || null;
  const demoEditoraToRequest = [
    {
      id: "1",
      name: "John Doe",
      username: "john_doe",
      profilePicture: "https://randomuser.me/api/port",
      skills: ["JavaScript", "React", "Node.js"],
      rating: 4.5,
      editedProjects: [{ deadline: new Date() }],
      _count: { editedProjects: 5 }
    },
    {
      id: "2",
      name: "Jane Doe",
      username: "jane_doe",
      profilePicture: "https://randomuser.me/api/port",
      skills: ["TypeScript", "React", "Node.js"],
      rating: 4.2,
      editedProjects: [{ deadline: new Date() }],
      _count: { editedProjects: 3 }
    },
    {
      id: "3",
      name: "John Smith",
      username: "john_smith",
      profilePicture: "https://randomuser.me/api/port",
      skills: ["JavaScript", "React", "Node.js"],
      rating: 4.7,
      editedProjects: [{ deadline: new Date() }],
      _count: { editedProjects: 7 }
    },
    {
      id: "4",
      name: "Jane Smith",
      username: "jane_smith",
      profilePicture: "https://randomuser.me/api/port",
      skills: ["TypeScript", "React", "Node.js"],
      rating: 4.3,
      editedProjects: [{ deadline: new Date() }],
      _count: { editedProjects: 4 }
    }
  ];
  const allEditors = await getEditorsToRequest(id);
  // const allEditors = demoEditoraToRequest;
  await markAllOfProjectAsRead(id);
  return (
    <div className="w-lvw h-lvh flex flex-col gap-4 justify-between items-center">
      <UserNavbar/>
      <Card className="w-4/5 flex flex-col gap-4 justify-start items-start border-none shadow-none">
        <CardHeader className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-col justify-center items-start">
            <CardTitle className="text-4xl">{title}</CardTitle>
            <CardDescription className="text-lg">{description}</CardDescription>
          </div>
          <div className="flex flex-row gap-4 justify-center items-center">
            {completed && editor && (
              <Dialog>
                <DialogTrigger>
                  <Button variant="outline">Rate Editor</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rate Your Editor</DialogTitle>
                    <DialogDescription>Rate the editor for this project</DialogDescription>
                  </DialogHeader>
                  <div className="w-full flex gap-4 justify-start items-start">
                    <ProfilePicture url={editor.profilePicture} name={editor.name} />
                    <div>
                      <h3 className="text-2xl font-semibold">{editor?.name}</h3>
                      <p className="text-gray-500">{editor._count.editedProjects} project{(editor._count.editedProjects || 0) > 1 ? 's' : ''} completed</p>
                    </div>
                  </div>
                  <EditorRating editorId={editor.id} projectId={id}/>
                </DialogContent>
              </Dialog>
            )}
            {editor ? 
              <Link href="/chat">
                <Button className="flex justify-between items-center gap-3">
                  <MessageSquare size={24} />
                  <p>{isCreator ? "Chat with Editor" : "Chat with Creator"}</p>
                </Button>
              </Link>
              :
              !isCreator ? 
                <RequestEditButton projectId={id}/>
                :
                <Dialog>
                  <DialogTrigger>
                    <Button>Request Editor</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request an Editor</DialogTitle>
                      <DialogDescription>
                        Search and request an editor for your project : {title}
                      </DialogDescription>
                    </DialogHeader>
                    <RequestEditorDialog projectId={id} allEditors={allEditors}/>
                  </DialogContent>
                </Dialog>
            }
          </div>
        </CardHeader>
        <CardContent className="w-full flex justify-between gap-5 items-start">
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full flex flex-col gap-4 justify-start items-start text-sm">
                <div className="w-full grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Project Type</p>
                    <p className="text-gray-600">{type.split('_').map(a => a.slice(0,1)+a.slice(1).toLowerCase()).join(' ')}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Status</p>
                    <Badge variant={status == "Completed" ? "default" : "secondary"} className="w-fit">{status}</Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Duration</p>
                    <p className="text-gray-600">{duration} minutes</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Deadline</p>
                    <p className="text-gray-600">{deadline.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2 justify-start items-start">
                  <p className="font-semibold">Progress</p>
                  <Progress value={progress} max={totalInstructions+2} />
                  <p className="text-gray-600">{parseInt(progress.toString())}% Complete</p>
                </div>
              </div>
              <hr className="w-full border-t border-gray-200 my-5" />
              <div className="w-full">
                <p className="font-semibold text-xl">Instructions</p>
                <div className="w-full mt-5">
                  <p className="font-semibold">Completed Instructions</p>
                  <div className="mt-3 w-full flex flex-col gap-1 justify-start items-center">
                    {Instructions.filter(({ status }) => status === "COMPLETED").map(({ id, content, nature }) => (
                      <div key={id} className="w-full flex flex-row justify-between items-center rounded bg-gray-300 p-2">
                        <div className="flex justify-start items-center gap-3">
                          <CheckCircle color="green" size={24} />
                          <p>{content}</p>
                        </div>
                        <Badge variant={nature == "COMPULSORY" ? "default" : "secondary"} className="w-fit">{nature}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full mt-5">
                  <p className="font-semibold">Pending Instructions</p>
                  <div className="mt-3 w-full flex flex-col gap-1 justify-start items-center">
                    {Instructions.filter(({ status }) => status === "PENDING").map(({ id, content, nature }) => (
                      <div key={id} className="w-full flex flex-row justify-between items-center rounded bg-gray-300 p-2">
                        <p>{content}</p>
                        <Badge variant={nature == "COMPULSORY" ? "default" : "secondary"} className="w-fit">{nature}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <hr className="w-full border-t border-gray-200 my-5" />
                <div className="w-full">
                  <p className="font-semibold text-xl">Project Files</p>
                  <div className="w-full mt-5 flex flex-col gap-1 justify-start text-center">
                    {FileVersion.map(({ id, url, name, version, createdAt }) => (
                      <div key={id} className="w-full flex flex-row justify-between items-center rounded bg-gray-300 p-2">
                        <div className="flex justify-start items-center gap-2">
                          <FileVideo size={24} />
                          <p>{name}</p>
                        </div>
                        <div className="flex justify-start items-center gap-4">
                          <Badge variant="secondary" className="w-fit font-bold">v{version}</Badge>
                          <p className="text-gray-600 text-xs">Uploaded on : {createdAt.toLocaleDateString()}</p>
                          <Link href={url} className="cursor-pointer">
                            <Download size={18} />
                          </Link>
                          <Eye className="cursor-pointer ml-4" size={18} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="w-[30%] flex flex-col gap-4 justify-start items-start">
            {(!isCreator || (isCreator && editor)) && <Card className="w-full">
              <CardHeader>
                <CardTitle>{isCreator ? "Editor" : "Creator"}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-start items-center gap-4">
                <ProfilePicture url={isCreator ? editor?.profilePicture : creator.profilePicture} name={isCreator ? editor?.name : creator.name} />
                <div className="flex flex-col gap-1 justify-center items-start">
                  <p className="font-semibold">{isCreator ? editor?.name : creator.name}</p>
                  <Badge variant="default" className="w-fit">
                    {isCreator ?
                      Number(editor?.rating.toFixed(1)).toString()+" / 5"
                      :
                      creator._count.createdProjects.toString() + " Project"+(creator._count.createdProjects > 1 ? "s" : "")}
                  </Badge>
                </div>
              </CardContent>
            </Card>}
            {((editor && !isCreator) || (editor && isCreator && ThumbnailVersion.length > 0)) && <Card className="w-full">
              <CardHeader>
                <CardTitle>Thumbnail</CardTitle>
                <CardDescription>Current Thumbnail and version history</CardDescription>
              </CardHeader>
              <CardContent className="w-full flex flex-col gap-2 justify-start relative">
                {ThumbnailVersion.length > 0 && (
                  <>
                    <Dialog>
                      <DialogTrigger>
                        <Eye className="cursor-pointer ml-4 absolute top-3 right-7 bg-white p-px" size={24} />
                      </DialogTrigger>
                      <DialogContent className="max-h-[90%]">
                        <DialogHeader>
                          <DialogTitle>
                            {ThumbnailVersion[0].name} - v{ThumbnailVersion[0].version}
                          </DialogTitle>
                          <DialogDescription>
                            Uploaded on : {createdAt.toLocaleDateString()}
                          </DialogDescription>
                          <Image src={ThumbnailVersion[0].url} alt={ThumbnailVersion[0].name} height={400} width={400} className="w-full h-[70%] object-cover rounded" />
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Image
                      src={ThumbnailVersion[0].url}
                      alt={ThumbnailVersion[0].name}
                      height={192}
                      width={208}
                      className="w-full h-48 object-cover rounded"
                    />
                    <div className="w-full flex flex-row justify-between items-center">
                      <p className="text-gray-600">
                        Last Updated: {ThumbnailVersion[0].createdAt.toLocaleDateString()}
                      </p>
                      <Dialog>
                        <DialogTrigger>
                          <Button variant="outline" className="w-fit">
                            View History
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full flex flex-col gap-2 justify-start items-start">
                          <DialogHeader>
                            <DialogTitle>Thumbnail Version History</DialogTitle>
                            <DialogDescription>View the history of the thumbnail versions</DialogDescription>
                          </DialogHeader>
                          {ThumbnailVersion.map(({ id, url, name, version, createdAt }) => (
                            <div key={id} className="w-full flex flex-row justify-between items-center rounded bg-gray-300 p-2">
                              <div className="flex justify-start items-center gap-2">
                                <Image src={url} alt={name} height={24} width={24} className="rounded" />
                                <p>{name}</p>
                              </div>
                              <div className="flex justify-start items-center gap-4">
                                <Badge variant="secondary" className="w-fit font-bold">v{version}</Badge>
                                <p className="text-gray-600 text-xs">Uploaded on : {createdAt.toLocaleDateString()}</p>
                                <Link href={url} className="cursor-pointer">
                                  <Download size={18} />
                                </Link>
                                <Dialog>
                                  <DialogTrigger>
                                    <HoverCard>
                                      <HoverCardTrigger>
                                        <Eye className="cursor-pointer ml-4" size={18} />
                                      </HoverCardTrigger>
                                      <HoverCardContent>
                                        <Image src={url} alt={name} height={400} width={400} className="w-full h-auto object-cover rounded" />
                                      </HoverCardContent>
                                    </HoverCard>
                                  </DialogTrigger>
                                  <DialogContent className="max-h-[90%]">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {name} - v{version}
                                      </DialogTitle>
                                      <DialogDescription>
                                        Uploaded on : {createdAt.toLocaleDateString()}
                                      </DialogDescription>
                                      <Image src={url} alt={name} height={400} width={400} className="w-full h-[70%] object-cover rounded" />
                                    </DialogHeader>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          ))}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </>
                )}
                {!isCreator && (
                  <>
                    <hr className="w-full border-t border-gray-200 my-3" />
                    <UploadThumbnail projectId={id} height={100} width={300}/>
                  </>
                )}
              </CardContent>
            </Card>}
            {(editor || (!editor && isCreator)) && <Card className="w-full">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="w-full flex flex-col gap-2 justify-start">
                {isCreator && !completed && refreshToken && totalInstructions == completedInstructions && (
                  <ApproveUploadButton projectId={id} refreshToken={refreshToken}/>
                )}
                {editor && <Dialog>
                  <DialogTrigger>
                    <Button className="w-full">
                      {isCreator ? "Request Revision" : totalInstructions == completedInstructions ? "Submit for Approval" : "Upload New Version"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`max-h-lvh h-auto overflow-y-scroll ${!isCreator && totalInstructions != completedInstructions ? "max-w-6xl" : "max-w-lg"}`}>
                    <DialogHeader>
                      <DialogTitle>
                      {isCreator ? "Request Revision" : totalInstructions == completedInstructions ? "Submit for Approval" : "Upload New Version"}
                      </DialogTitle>
                      <DialogDescription>
                        {isCreator ? "Request a revision from the editor" : totalInstructions == completedInstructions ? "Submit the project for final review" : "Upload a new version of the project"}
                      </DialogDescription>
                    </DialogHeader>
                    {isCreator ?
                      <RequestrevisionForm projectId={id}/>
                      :
                      <UploadNewVersionForm
                        projectId={id}
                        instructions={Instructions.filter(({ status }) => status == "PENDING").map(({ id, content, nature }) => ({ id, content, nature }))}
                      />
                    }
                  </DialogContent>
                </Dialog>}
                <Dialog>
                  <DialogTrigger>
                    <Button variant="outline" className="w-full">
                      {isCreator ? "Extend Deadline" : "Request Deadline Extension"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {isCreator ? "Extend Deadline" : "Request Deadline Extension"}
                      </DialogTitle>
                      <DialogDescription>
                        {isCreator ? "Extend the deadline of the project" : "Request an extension of the deadline"}
                      </DialogDescription>
                    </DialogHeader>
                    <ExtendDeadlineForm projectId={id} isCreator={isCreator}/>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent className="w-full flex flex-col gap-4 justify-start items-center text-sm">
                <div className="w-full flex flex-row justify-between items-center">
                  <p className="font-semibold">Created project</p>
                  <p className="text-gray-600">{createdAt.toLocaleDateString()}</p>
                </div>
                <div className="w-full flex flex-row justify-between items-center">
                  <p className="font-semibold">Deadline</p>
                  <p className="text-gray-600">{deadline.toLocaleDateString()}</p>
                </div>
              </CardContent>
              <CardFooter className="w-full flex justify-start items-center gap-4 text-sm">
                <Clock size={18} />
                <p>
                  {new Date().getTime() > deadline.getTime() ?
                    "Project is overdue"
                    :
                    Math.floor((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + " days remaining"
                  }
                </p>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      {isCreator && !editor && <Card className="w-4/5 mx-auto">
        <CardHeader>
          <CardTitle>Editor Requests</CardTitle>
          <CardDescription>{requests.length} editor{requests.length > 1 ? "s" : ""} requested to edit this project</CardDescription>
        </CardHeader>
        <EditRequests initialRequests={requests}/>
      </Card>}
      <Footer />
    </div>
  )
}

export default ProjectPage