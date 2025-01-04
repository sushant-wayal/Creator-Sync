"use client";

import { useEffect, useState } from "react";
import { SingleImageUpload } from "../General/SingleImageUpload";
import { uploadThumbnail } from "@/actions/thumbnailVersion";
import { useRouter } from "next/navigation";

interface UploadThumbnailProps {
  projectId: string;
  height?: number;
  width?: number;
}

export const UploadThumbnail : React.FC<UploadThumbnailProps> = ({ projectId, height, width }) => {
  const router = useRouter();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    const upload = async () => {
      if (name && thumbnailUrl) {
        await uploadThumbnail(projectId, name, thumbnailUrl);
        router.refresh();
      }
    };
    upload();
  }, [thumbnailUrl]);
  return (
    <SingleImageUpload setUrl={setThumbnailUrl} setName={setName} height={height} width={width} buttonText="Upload Thumbnail"/>
  )
};