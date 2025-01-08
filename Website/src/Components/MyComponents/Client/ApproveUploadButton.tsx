"use client";

import { getAddress } from "@/actions/user";
import { Button } from "@/Components/ui/button";
import { domain } from "@/constants";
import { paymentComplete } from "@/helper/contract";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ApproveUploadButtonProps {
  projectId: string;
  refreshToken: string;
}

export const ApproveUploadButton : React.FC<ApproveUploadButtonProps> = ({ projectId, refreshToken }) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  return (
    <Button
      onClick={async () => {
        setUploading(true);
        const toastId = toast.loading("Transacting...");
        const address = await getAddress();
        if (!address) {
          toast.error("Your account address is not connected", { id: toastId });
          return;
        }
        await paymentComplete(projectId);
        toast.loading("Uploading...", { id: toastId });
        await axios.post(`${domain}/api/youtube/upload`, {
          projectId,
          refreshToken,
        })
        toast.success("Uploaded successfully", { id: toastId });
        setUploading(false);
        router.refresh();
      }}
      disabled={uploading}
    >
      Approve & Upload
    </Button>
  );
};