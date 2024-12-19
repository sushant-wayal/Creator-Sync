import { auth } from "@/auth";
import { Footer } from "@/Components/MyComponents/General/Footer";
import { UserNavbar } from "@/Components/MyComponents/General/UserNavbar";
import { demoUser } from "../profile/[username]/page";
import { ChartNoAxesColumnIncreasing, Clock, FileVideo, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import Link from "next/link";
import { getUser } from "@/actions/user";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth();
  if (!session || !session.user) throw new Error("Not Authenticated");
  const { name, username } = session.user;
  const user = await getUser(username);
  if (!user) throw new Error("User not found");
  // const user = demoUser;
  if ((new Date()).getTime() - user.createdAt.getTime() < 6000) {
    redirect(`/profile/${username}/edit`);
  }
  const noOfLastMonthProject = user.createdProjects.filter(project => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return new Date(project.createdAt) > lastMonth;
  }).length + user.editedProjects.filter(project => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return new Date(project.createdAt) > lastMonth;
  }).length;
  const noOfInprogressProjects = user.createdProjects.filter(project => !project.completed).length + user.editedProjects.filter(project => !project.completed).length;
  const noOfDueProjectsThisWeek = user.createdProjects.filter(project => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return (new Date(project.deadline) < nextWeek) && !project.completed;
  }).length + user.editedProjects.filter(project => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return (new Date(project.deadline) < nextWeek) && !project.completed;
  }).length;
  const noOfCompletedProjects = user.createdProjects.filter(project => project.completed).length + user.editedProjects.filter(project => project.completed).length;
  const noOfCompletedProjectsThisMonth = user.createdProjects.filter(project => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return (new Date(project.updatedAt) > lastMonth) && project.completed;
  }).length + user.editedProjects.filter(project => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return (new Date(project.updatedAt) > lastMonth) && project.completed;
  }).length;
  const noOfActiveEditors = (new Set(user.createdProjects.filter(({ completed }) => !completed).map(({ editorId }) => editorId))).size;
  const noOfActiveCreators = (new Set(user.editedProjects.filter(({ completed }) => !completed).map(({ creatorId }) => creatorId))).size;
  const allProjects = user.createdProjects.concat(user.editedProjects).sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
  return (
    <div className="flex flex-col justify-between items-center gap-4 w-lvw min-h-lvh">
      <UserNavbar/>
      <div className="w-lvw p-8 space-y-8">
        <h1 className="text-3xl font-bold">Welcome Back, {name}!</h1>
        <div className="w-full grid grid-cols-4 gap-4">
          <div className="flex flex-col justify-between items-start border-[1px] border-gray-200 p-4 rounded-lg">
            <div className="flex justify-between items-center w-full">
              <h2 className="font-semibold">Total Projects</h2>
              <FileVideo color="gray" size={18} />
            </div>
            <div className="flex flex-col justify-between items-start gap-1">
              <p className="text-3xl font-bold">{user.createdProjects.length + user.editedProjects.length}</p>
              <p className="text-sm text-gray-500">
                {noOfLastMonthProject > 0 ?
                  `+${noOfLastMonthProject} from last month`
                  :
                  "No new projects from last month"
                }
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start border-[1px] border-gray-200 p-4 rounded-lg">
            <div className="flex justify-between items-center w-full">
              <h2 className="font-semibold">In Progress</h2>
              <Clock color="gray" size={18} />
            </div>
            <div className="flex flex-col justify-between items-start gap-1">
              <p className="text-3xl font-bold">{noOfInprogressProjects}</p>
              <p className="text-sm text-gray-500">
                {noOfDueProjectsThisWeek > 0 ?
                  `${noOfDueProjectsThisWeek} due this week`
                  :
                  ""
                }
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start border-[1px] border-gray-200 p-4 rounded-lg">
            <div className="flex justify-between items-center w-full">
              <h2 className="font-semibold">Completed</h2>
              <ChartNoAxesColumnIncreasing color="gray" size={18} />
            </div>
            <div className="flex flex-col justify-between items-start gap-1">
              <p className="text-3xl font-bold">{noOfCompletedProjects}</p>
              <p className="text-sm text-gray-500">
                {noOfCompletedProjectsThisMonth > 0 ?
                  `+${noOfCompletedProjectsThisMonth} this month`
                  :
                  "No projects completed this month"
                }
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start border-[1px] border-gray-200 p-4 rounded-lg">
            <div className="flex justify-between items-center w-full">
              <h2 className="font-semibold">
                {user.readyToEdit ? "Collaborations" : "Active Editors"}
              </h2>
              <Users color="gray" size={18} />
            </div>
            <div className="flex flex-col justify-between items-start gap-1">
              <p className="text-3xl font-bold">{user.readyToEdit ? noOfActiveEditors + noOfActiveCreators : noOfActiveEditors}</p>
              <p className="text-sm text-gray-500">
                {user.readyToEdit ?
                  "Working with You"
                  :
                  "Working on your project"
                }
              </p>
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
          {allProjects.map(({ id, title, updatedAt, Instructions, completed }) => {
            const totalInstructions = Instructions.length;
            const completedInstructions = Instructions.filter(({ status }) => status == "COMPLETED").length;
            const progress = parseInt((((completedInstructions+1)/(totalInstructions+2))*100).toString());
            const status = completed ? "Completed" : completedInstructions == 0 ? "Just Started" : completedInstructions == totalInstructions ? "Final Review" : "In Progress";
            const timeAgo = (new Date()).getTime() - updatedAt.getTime();
            const lastUpdated = parseInt((timeAgo/(365*24*60*60*100)).toString()) > 0 ? `${parseInt((timeAgo/(365*24*60*60*100)).toString())} Years` : parseInt((timeAgo/(30*24*60*60*100)).toString()) > 0 ? `${parseInt((timeAgo/(30*24*60*60*100)).toString())} Months` : parseInt((timeAgo/(7*24*60*60*100)).toString()) > 0 ? `${parseInt((timeAgo/(7*24*60*60*100)).toString())} Weeks` : parseInt((timeAgo/(24*60*60*100)).toString()) > 0 ? `${parseInt((timeAgo/(24*60*60*100)).toString())} Days` : parseInt((timeAgo/(60*60*100)).toString()) > 0 ? `${ parseInt((timeAgo/(60*60*100)).toString())} Hours` : `${ parseInt((timeAgo/(60*100)).toString())} Minutes`
            return (
              <Link href={`/project/${id}`}>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold">{title}</CardTitle>
                    <CardDescription>
                      Last updated {lastUpdated} ago
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p>Progress</p>
                      <Badge variant={status == "Completed" ? "secondary" : "default"}>{status}</Badge>
                    </div>
                    <Progress value={progress} max={100}/>
                    <p className="text-sm text-gray-500">{progress}% completed</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
