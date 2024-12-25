"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {ThumbnailAnnotation } from "./Collaboration";
import { CheckCircle } from "lucide-react";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Annotation } from "./Annotation";
import { createThumbnailAnnotation } from "@/actions/thumbnailAnnotation";

interface ImageAnnotationProps {
  ThumbnailVersionId: string;
  src?: string;
  annotations: ThumbnailAnnotation[];
  setAnnotations: Dispatch<SetStateAction<ThumbnailAnnotation[]>>;
  showAnnotation?: string;
  creator: {
    name: string;
    profilePicture: string | null;
  }
  isCreator: boolean;
  className?: string;
}

export const ImageAnnotation : React.FC<ImageAnnotationProps> = ({ ThumbnailVersionId, src, annotations, setAnnotations, creator, className, showAnnotation, isCreator }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const addAnnotationRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [openAnnotations, setOpenAnnotations] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    if (showAnnotation) {
      if (imageRef.current) {
       //.......
      }
    }
  }, [imageRef.current, showAnnotation]);
  
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCreator) return;
    e.preventDefault();
    setIsOpen(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className={`${className} relative`}
      onContextMenu={handleContextMenu}
    >
      <div className={`w-80 z-10 space-y-3 fixed bg-white border-[1px] border-gray-300 p-4 shadow-md transition-all duration-300 ease-in-out rounded-lg ${isOpen ? "" : "hidden"}`}
        style={{
          top: position.y + (addAnnotationRef.current?.clientHeight || 0) > window.innerHeight ? position.y - (addAnnotationRef.current?.clientHeight || 0) : position.y,
          left: position.x + (addAnnotationRef.current?.clientWidth || 0) > window.innerWidth ? position.x - (addAnnotationRef.current?.clientWidth || 0) : position.x,
        }}
        ref={addAnnotationRef}
      >
        <Textarea
          placeholder="Add your feedback..."
          className="w-full h-20"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="flex justify-end items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false)
              setFeedback("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={async () => {
              setIsOpen(false)
              const x = (position.x - (imageRef.current?.getBoundingClientRect().left || 0)) / (imageRef.current?.clientWidth || 1);
              const y = (position.y - (imageRef.current?.getBoundingClientRect().top || 0)) / (imageRef.current?.clientHeight || 1);
              setAnnotations(prev => [...prev, 
                {
                  id: prev.length.toString(),
                  content: feedback,
                  x,
                  y,
                  resolved: false,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  ThumbnailVersionId,
                }]);
              setFeedback("");
              await createThumbnailAnnotation(ThumbnailVersionId, x, y, feedback);
            }}
          >
            Save
          </Button>
        </div>
      </div>
      <img src={src} className="w-full h-full -z-[10]" ref={imageRef}/>
      {annotations.map((annotation, index) => (
        <div key={index}>
          <div
            className={`absolute w-5 h-5 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 justify-center items-center cursor-pointer`}
            style={{
              top: `${annotation.y*100}%`,
              left: `${annotation.x*100}%`,
            }}
            onClick={() => {
              if (openAnnotations.includes(annotation.id)) {
                setOpenAnnotations(prev => prev.filter(id => id !== annotation.id));
              } else {
                setOpenAnnotations(prev => [...prev, annotation.id]);
              }
            }}
          >
            <CheckCircle color="white" className="h-4 w-4"/>
          </div>
          <Annotation annotation={annotation} creator={creator} openAnnotations={openAnnotations} setOpenAnnotations={setOpenAnnotations}/>
        </div>
      ))}
    </div>
  )
}