"use client";

import { formatDistanceToNow } from "date-fns";
import { ProfilePicture } from "../General/ProfilePicture";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface AnnotationProps {
  annotation: {
    id: string;
    x: number;
    y: number;
    timeStamp?: number;
    content: string;
    createdAt: Date;
  };
  playerHeight?: number;
  playerWidth?: number;
  creator: {
    name: string;
    profilePicture: string | null;
  };
  timeStamp?: number;
  openAnnotations: string[];
  setOpenAnnotations: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Annotation : React.FC<AnnotationProps> = ({ annotation, playerHeight, playerWidth, creator, timeStamp, openAnnotations, setOpenAnnotations }) => {
  const annotationRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (annotationRef.current) {
      const rect = annotationRef.current.getBoundingClientRect();
      console.log(rect);
      if (annotation.x * (playerWidth ?? 0) + rect.width > window.innerWidth) {
        annotationRef.current.style.left = `${window.innerWidth - rect.width}px`;
      }
      if (annotation.y * (playerHeight ?? 0) + rect.height > window.innerHeight) {
        annotationRef.current.style.top = `${window.innerHeight - rect.height}px`;
      }
    }
  }, [annotationRef.current, openAnnotations, playerHeight, playerWidth]);
  return (
    <div className={`w-80 z-10 absolute bg-white border-[1px] border-gray-300 p-4 shadow-md transition-all duration-300 ease-in-out rounded-lg ${openAnnotations.includes(annotation.id) && Math.abs((timeStamp ?? 0) - ((annotation?.timeStamp || timeStamp) ?? 0)) < 100 ? "flex" : "hidden"} justify-start items start gap-3`}
      style={{
        top: `${annotation.y*100}%`,
        left: `${annotation.x*100}%`,
      }}
      ref={annotationRef}
    >
      <X color="gray" className="h-4 w-4 cursor-pointer absolute top-2 right-2" onClick={() => setOpenAnnotations(prev => prev.filter(id => id !== annotation.id))}/>
      <ProfilePicture url={creator.profilePicture} name={creator.name} className="h-8 w-8 rounded-full"/>
      <div className="flex-grow space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">{creator.name}</p>
          <p className="text-xs text-gray-400">{formatDistanceToNow(annotation.createdAt)} ago</p>
        </div>
        <p className="text-sm">{annotation.content}</p>
      </div>
    </div>
  )
};