"use client";

import { Badge } from "@/Components/ui/badge";
import { ProfilePicture } from "../General/ProfilePicture";
import { $Enums } from "@prisma/client";
import { CheckCircle, Clock, FileVideo, MessageSquare, Star, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import { CardContent } from "@/Components/ui/card";
import { useState } from "react";
import { acceptRequest, rejectRequest } from "@/actions/requestEditor";

interface EditorRequestsProps {
  initialRequests: {
    id: string;
    project: {
      title: string;
      id: string;
      type: $Enums.ProjectType;
      duration: number;
      creator: {
        name: string;
        profilePicture: string | null;
        _count: {
          createdProjects: number;
        };
        username: string;
      };
      deadline: Date;
    };
    createdAt: Date;
    status: $Enums.RequestStatus;
}[];
}

export const EditorRequests: React.FC<EditorRequestsProps> = ({ initialRequests }) => {
  const [requests, setRequests] = useState(initialRequests);
  const handleAccept = async (id: string) => {
    console.log("acceptRequest", id);
    await acceptRequest(id);
    setRequests(requests.filter(request => request.id !== id));
  }
  const handleReject = async (id: string) => {
    await rejectRequest(id);
    setRequests(requests.filter(request => request.id !== id));
  }
  return (
    <CardContent className="w-full space-y-4">
      {requests.map(request => (
        <div className="space-y-3 border-[1px] border-gray-200 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{request.project.title}</h3>
              <div className="flex justify-start gap-2 items-center">
                <Badge variant="outline" className="text-[10px] font-bold">{request.project.type.split('_').map(a => a.slice(0,1)+a.slice(1).toLowerCase()).join(' ')}</Badge>
                <p className="text-gray-500">.</p>
                <p className="text-gray-500 text-sm">{request.project.duration} minutes</p>
              </div>
            </div>
            <Link href={`/project/${request.project.id}`}>
              <Button variant="outline">View Project</Button>
            </Link>
          </div>
          <div className="flex items-center justify-start gap-2">
            <ProfilePicture url={request.project.creator.profilePicture} name={request.project.creator.name}/>
            <div className="space-y-1">
              <h4 className="text-base font-semibold">{request.project.creator.name}</h4>
              <div className="flex gap-2 items-center">
                <Star size={16} color="black" className="fill-primary"/>
                <p className="text-gray-500">{request.project.creator._count.createdProjects} projects</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex justify-center gap-4 items-center text-sm">
              <div className="flex gap-2 items-center">
                <Clock size={16} color="gray"/>
                <p className="text-gray-500">Due {new Date(request.project.deadline).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 items-center">
                <FileVideo size={16} color="gray"/>
                <p className="text-gray-500">{request.project.duration} minutes</p>
              </div>
              <div className="flex gap-2 items-center">
                <MessageSquare size={16} color="gray"/>
                <p className="text-gray-500">Requested {formatDistanceToNow(request.createdAt)} ago</p>
              </div>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <Button className="text-sm flex items-center justify-center gap-1" variant="default"
                onClick={async () => await handleAccept(request.id)}
              >
                <CheckCircle size={16} color="white"/>
                <p>Accept</p>
              </Button>
              <Button className="text-sm flex items-center justify-center gap-1" variant="destructive"
                onClick={async () => await handleReject(request.id)}
              >
                <X size={16} color="white"/>
                <p>Reject</p>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  )
}