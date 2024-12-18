import { getProject } from "@/actions/project"
import { auth } from "@/auth"
import { ExtendDeadlineForm } from "@/Components/MyComponents/Forms/ExtendDeadlineForm"
import { RequestrevisionForm } from "@/Components/MyComponents/Forms/RequestRevisionForm"
import { UploadNewVersionForm } from "@/Components/MyComponents/Forms/UploadNewVersionForm"
import { Footer } from "@/Components/MyComponents/General/Footer"
import { Navbar } from "@/Components/MyComponents/General/Navbar"
import { ProfilePicture } from "@/Components/MyComponents/General/ProfilePicture"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog"
import { Progress } from "@/Components/ui/progress"
import { Check, CheckCircle, Clock, Download, Eye, FileVideo, MessageSquare } from "lucide-react"
import Link from "next/link"

interface ProjectPageProps {
  params: {
    id: string
  }
}

const ProjectPage : React.FC<ProjectPageProps> = async ({ params }) => {
  const { id } = params
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("You need to be authenticated to access this page")
  }
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
    editor: {
      id: "2",
      name: "Demo Editor",
      profilePicture: "https://example.com",
      rating: 4.5
    },
    createdAt: new Date()
  }
  // const { title, description, type, duration, deadline, Instructions, FileVersion, isCreator, completed, creator, editor, createdAt } = await getProject(id);
  const { title, description, type, duration, deadline, Instructions, FileVersion, isCreator, completed, creator, editor, createdAt } = demoProject;
  const totalInstructions = Instructions.length;
  const completedInstructions = Instructions.filter((instruction) => instruction.status === "COMPLETED").length;
  const status = completed ? "Completed" : completedInstructions === 0 ? "Just Started" : completedInstructions === totalInstructions ? "Final Review" : "In Progress";
  const progress = ((completedInstructions + 1) / (totalInstructions + 2)) * 100;
  return (
    <div className="w-lvw h-lvh flex flex-col gap-4 justify-between items-center">
      <Navbar links={[
        {name: "Dashboard", url: "/dashboard"},
        {name: "New Project", url: "/new-project"},
        {name: "Profile", url: "/profile"},
        {name: "Logout", url: "/logout"},
      ]}/>
      <Card className="w-4/5 flex flex-col gap-4 justify-start items-start">
        <CardHeader className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-col justify-center items-start">
            <CardTitle className="text-4xl">{title}</CardTitle>
            <CardDescription className="text-lg">{description}</CardDescription>
          </div>
          <Link href="/chat">
            <Button className="flex justify-between items-center gap-3">
              <MessageSquare size={24} />
              <p>{isCreator ? "Chat with Editor" : "Chat with Creator"}</p>
            </Button>
          </Link>
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
                    <p className="text-gray-600">{type}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Status</p>
                    <Badge variant={status == "Completed" ? "default" : "secondary"} className="w-fit">{status}</Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">Duration</p>
                    <p className="text-gray-600">{duration}</p>
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
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{isCreator ? "Editor" : "Creator"}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-start items-center gap-4">
                <ProfilePicture url={isCreator ? editor.profilePicture : creator.profilePicture} name={isCreator ? editor.name : creator.name} />
                <div className="flex flex-col gap-1 justify-center items-start">
                  <p className="font-semibold">{isCreator ? editor.name : creator.name}</p>
                  <Badge variant="default" className="w-fit">
                    {isCreator ?
                      Number(editor.rating.toFixed(1)).toString()+" / 5"
                      :
                      creator._count.createdProjects.toString() + " Project"+(creator._count.createdProjects > 1 ? "s" : "")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="w-full flex flex-col gap-2 justify-start">
                <Dialog>
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
                        instructions={Instructions.filter(({ status }) => status === "PENDING").map(({ id, content, nature }) => ({ id, content, nature }))}
                      />
                    }
                  </DialogContent>
                </Dialog>
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
            </Card>
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
      <Footer />
    </div>
  )
}

export default ProjectPage