"use client";

import { CardContent } from "@/Components/ui/card";
import { useState } from "react";
import { ProfilePicture } from "../General/ProfilePicture";
import { CheckCircle, Clock, Star, X } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/Components/ui/button";
import { acceptEditRequest, rejectEditRequest } from "@/actions/requestEdit";
import { useRouter } from "next/navigation";
import { paymentCreate } from "@/helper/contract";
import { toast } from "sonner";

interface EditRequestsProps {
  projectId: string;
  deadline: Date;
  initialRequests: {
    id: string;
    createdAt: Date;
    budget: number;
    editor: {
      id: string;
      name: string;
      profilePicture: string | null;
      rating: number;
      skills: string[];
      accountAddress: string | null;
      _count: {
        editedProjects: number;
      }
    }
  }[];
}

export const EditRequests: React.FC<EditRequestsProps> = ({ projectId, deadline, initialRequests }) => {
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const handleRejectRequest = async (requestId: string) => {
    await rejectEditRequest(requestId);
    setRequests(requests.filter((request) => request.id !== requestId));
  };
  const handleAcceptRequest = async (requestId: string) => {
    const toastId = toast.loading("Creating payment...");
    const request = requests.find((request) => request.id === requestId);
    if (!request) return;
    const { budget, editor: { accountAddress } } = request;
    if (!accountAddress) {
      toast.error("Editor's account address is not connected");
      return;
    }
    try {
      await paymentCreate(projectId, budget, deadline, accountAddress);
      toast.loading("Assigning Editor...", { id: toastId });
      await acceptEditRequest(requestId);
      toast.success("Editor assigned successfully", { id: toastId });
      router.refresh();
    } catch (error : any) {
      console.log(error);
      const errorMsg = String(error).split(`(`)[0].split(`:`)[1];
      toast.error(errorMsg, { id: toastId });
    }
  };
  return (
    <CardContent className="w-full flex flex-col gap-4 justify-start items-start">
      {requests.map(({ id, createdAt, editor, budget }) => (
        <div key={id} className="w-full rounded-lg border-[1px] border-gray-200 p-4 flex justify-between items-center">
          <div className="flex justify-center items-center gap-3">
            <ProfilePicture url={editor.profilePicture} name={editor.name} />
            <div className="space-y-2">
              <div className="flex gap-2 justify-start items-center">
                <p className="font-semibold">{editor.name}</p>
                <p className="text-gray-500">(${budget})</p>
              </div>
              <div className="flex gap-3 justify-center items-center text-gray-500 font-[450] text-sm">
                <div className="flex gap-2 justify-center items-center">
                  <Star size={18} color="black" className="fill-primary"/>
                  <p>{Number(editor.rating.toFixed(1))}</p>
                </div>
                <p>.</p>
                <p>{editor._count.editedProjects} Project{editor._count.editedProjects > 1 ? "s" : ""} edited</p>
              </div>
              <div className="flex gap-2 justify-start items-center">
                {editor.skills.slice(0, 3).map((skill) => (
                  <Badge variant="secondary" className="w-fit text-xs font-semibold">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-start items-center">
            <div className="flex justify-center gap-2 items-center text-sm">
              <Clock size={15} color="gray"/>
              <p className="text-gray-500">Requested {formatDistanceToNow(createdAt)} ago</p>
            </div>
            <Button
              variant="destructive"
              className="flex justify-center gap-2 items-center"
              onClick={() => handleRejectRequest(id)}
            >
              <X className="w-4 h-4" />
              <p>Reject</p>
            </Button>
            <Button
              className="flex justify-center gap-2 items-center"
              onClick={() => handleAcceptRequest(id)}
            >
              <CheckCircle className="w-4 h-4" />
              <p>Accept</p>
            </Button>
          </div>
        </div>
      ))}
    </CardContent>
  );
};