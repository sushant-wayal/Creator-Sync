"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { NotificationType } from "@prisma/client";
import { Bookmark, BookmarkCheck, CalendarCheck, CheckCircle, Eye, FileVideo, IndianRupee, Key, ListChecks, Star, Users, Youtube } from "lucide-react";
import { useState } from "react";
import { ProfilePicture } from "../General/ProfilePicture";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import { markAllAsRead, markAsRead } from "@/actions/notification";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  senderProjectRole: "CREATOR" | "EDITOR" | "SYSTEM";
  createdAt: Date;
  read: boolean;
  from: {
    name: string;
    profilePicture: string | null;
  } | null;
  projectId: string | null;
  project: {
    title: string;
  } | null;
}

interface NotificationProps {
  notifications: Notification[];
}

/*
PROJECT_UPDATE
INSTRUCTION_UPDATE
DEADLINE_EXTENDED
REQUEST_DEADLINE_EXTENSION
REQUEST_EDIT
REQUEST_EDITOR
ACCEPT_REQUEST_EDIT
ACCEPT_REQUEST_EDITOR
COMPLETED_PROJECT
RATING
PAYMENT
EMAIL_VERIFICATION
PASSWORD_RESET
YOUTUBE_REFRESH
*/

const Icons = ({ condition, props }: { condition: boolean; props: { icon: React.ElementType; [key: string]: any } }) => condition ? <props.icon {...props}/> : null;

// Icons({ condition: true, props: { icon } })

export const Notifications : React.FC<NotificationProps> = ({ notifications }) => {
  const router = useRouter();
  const [notificationType, setNotificationType] = useState<NotificationType | "all">("all");
  return (
    <div className="flex-grow flex flex-col justify-start items-center gap-8 w-5/6">
      <div className="h-auto flex justify-between items-center w-full">
        <div className="flex flex-col gap-2 justify-center items-start">
          <h1 className="text-4xl font-bold text-black text-left w-full">Notifications</h1>
          <p className="text-gray-500">Stay Updated with your projects</p>
        </div>
        <div className="flex justify-center items-center gap-2">
          <Select
            value={notificationType}
            onValueChange={(e) => setNotificationType(e as NotificationType | "all")}
          >
            <SelectTrigger className="w-48 bg-white placeholder:text-[#444444] text-black">
              <SelectValue placeholder="Filter by Type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="PROJECT_UPDATE">Project Update</SelectItem>
              <SelectItem value="INSTRUCTION_UPDATE">Instruction Update</SelectItem>
              <SelectItem value="DEADLINE_EXTENDED">Deadline Extended</SelectItem>
              <SelectItem value="REQUEST_DEADLINE_EXTENSION">Request Deadline Extension</SelectItem>
              <SelectItem value="REQUEST_EDIT">Request Edit</SelectItem>
              <SelectItem value="REQUEST_EDITOR">Request Editor</SelectItem>
              <SelectItem value="ACCEPT_REQUEST_EDIT">Accept Request Edit</SelectItem>
              <SelectItem value="ACCEPT_REQUEST_EDITOR">Accept Request Editor</SelectItem>
              <SelectItem value="COMPLETED_PROJECT">Completed Project</SelectItem>
              <SelectItem value="NEW_ANNOTATION">New Annotation</SelectItem>
              <SelectItem value="RESOLVED_ANNOTATION">Resolved Annotation</SelectItem>
              <SelectItem value="RATING">Rating</SelectItem>
              <SelectItem value="PAYMENT">Payment</SelectItem>
              <SelectItem value="EMAIL_VERIFICATION">Email Verification</SelectItem>
              <SelectItem value="PASSWORD_RESET">Password Reset</SelectItem>
              <SelectItem value="YOUTUBE_REFRESH">Youtube Refresh</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="w-fit"
            onClick={async () => {
              await markAllAsRead();
              router.refresh();
            }}
          >Mark All Read</Button>
        </div>
      </div>
      <div className="flex-grow flex flex-col gap-4 w-full">
        {notifications.length === 0 && (
          <div className="flex justify-center items-center w-full h-[60vh]">
            <p className="text-8xl font-semibold text-black">No Notifications Yet</p>
          </div>
        )}
        {notifications.filter((n) => notificationType === "all" || n.type === notificationType).map((n) => (
          <div key={n.id} className={`flex justify-between items-center w-full p-4 shadow-md rounded-lg ${n.read ? "" : "bg-muted/50"}`}>
            <div className="flex justify-center items-start gap-2">
              <div className="flex justify-center items-center w-12 h-12 bg-gray-200 rounded-full">
                {n.type === "PROJECT_UPDATE" && <Icons condition={true} props={{ icon: FileVideo }} />}
                {n.type === "INSTRUCTION_UPDATE" && <Icons condition={true} props={{ icon: ListChecks }} />}
                {n.type === "DEADLINE_EXTENDED" && <Icons condition={true} props={{ icon: CalendarCheck }} />}
                {n.type === "REQUEST_DEADLINE_EXTENSION" && <Icons condition={true} props={{ icon: CalendarCheck }} />}
                {n.type === "REQUEST_EDIT" && <Icons condition={true} props={{ icon: Users }} />}
                {n.type === "REQUEST_EDITOR" && <Icons condition={true} props={{ icon: Users }} />}
                {n.type === "ACCEPT_REQUEST_EDIT" && <Icons condition={true} props={{ icon: Users }} />}
                {n.type === "ACCEPT_REQUEST_EDITOR" && <Icons condition={true} props={{ icon: Users }} />}
                {n.type === "COMPLETED_PROJECT" && <Icons condition={true} props={{ icon: CheckCircle }} />}
                {n.type === "NEW_ANNOTATION" && <Icons condition={true} props={{ icon: Bookmark }} />}
                {n.type === "RESOLVED_ANNOTATION" && <Icons condition={true} props={{ icon: BookmarkCheck }} />}
                {n.type === "RATING" && <Icons condition={true} props={{ icon: Star }} />}
                {n.type === "PAYMENT" && <Icons condition={true} props={{ icon: IndianRupee }} />}
                {n.type === "EMAIL_VERIFICATION" && <Icons condition={true} props={{ icon: CheckCircle }} />}
                {n.type === "PASSWORD_RESET" && <Icons condition={true} props={{ icon: Key }} />}
                {n.type === "YOUTUBE_REFRESH" && <Icons condition={true} props={{ icon: Youtube }} />}
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-semibold text-black">{n.title}</h1>
                <p className="text-sm font-normal text-gray-500">{n.message}</p>
                <div className="flex justify-start items-center gap-3">
                 {n.from && n.project && (
                  <>
                    <div className="flex justify-center items-center gap-2">
                      <ProfilePicture url={n.from.profilePicture} name={n.from.name}/>
                      <h3 className="text-sm text-black">{n.from.name}</h3>
                      <Badge variant="outline" className="w-fit">{n.senderProjectRole}</Badge>
                    </div>
                    <Separator orientation="vertical" className="h-4"/>
                    <h3 className="text-sm text-black">{n.project.title}</h3>
                    <Separator orientation="vertical" className="h-4"/>
                  </>)}
                  <p className="text-sm text-gray-500">{formatDistanceToNow(n.createdAt)} ago</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center gap-2">
              {!n.read && <Badge className="w-fit">New</Badge>}
              {n.projectId && <Link href={`/project/${n.projectId}`}><Button variant="outline"><Eye className="w-6 h-6 text-gray-500"/></Button></Link>}
              {!n.projectId && (
                <Button
                  variant="outline"
                  className="w-fit"
                  onClick={async () => {
                    await markAsRead(n.id);
                    router.refresh();
                  }}
                >Mark Read</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}