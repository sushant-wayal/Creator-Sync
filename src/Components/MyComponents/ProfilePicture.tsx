"use client"

import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect } from "react";

interface ProfilePictureProps {
  url?: string | null;
  name?: string;
  height?: number;
  width?: number;
  className?: string;
}

export const ProfilePicture : React.FC<ProfilePictureProps> = ({ url, name, className }) => {
  useEffect(() => {
    const getProfile = async () => {
      if (!url && !name) {
        const session = await auth();
        url = session?.user.profilePicture;
        name = session?.user.name || "";
      }
    }
    getProfile();
  }, [])
  return (
    <Avatar className={className}>
      <AvatarImage src={url || undefined} alt={name} />
      <AvatarFallback>{name?.split(" ").map(word => word[0].toUpperCase()).join("") || "?"}</AvatarFallback>
    </Avatar>
  );
}