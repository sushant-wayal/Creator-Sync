"use client";

import { Button } from "@/Components/ui/button";
import { domain } from "@/constants";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface ApproveUploadButtonProps {
  projectId: string;
  refreshToken: string;
}

export const ApproveUploadButton : React.FC<ApproveUploadButtonProps> = ({ projectId, refreshToken }) => {
  const [uploading, setUploading] = useState(false);
  return (
    <Button
      onClick={async () => {
        setUploading(true);
        const toastId = toast.loading("Uploading...");
        await axios.post(`${domain}/api/youtube/upload`, {
          projectId,
          refreshToken,
        })
        toast.success("Uploaded successfully", { id: toastId });
        setUploading(false);
      }}
      disabled={uploading}
    >
      Approve & Upload
    </Button>
  );
};