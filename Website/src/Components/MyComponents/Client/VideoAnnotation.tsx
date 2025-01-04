"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FileAnnotation } from "./Collaboration";
import { Slider } from "@/Components/ui/slider";
import { CheckCircle, Fullscreen, Minimize, Pause, Play, Volume2, VolumeOff, X } from "lucide-react";
import { formatTime } from "@/constants";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Annotation } from "./Annotation";
import { Tooltip } from "./Tooltip";
import { createFileAnnotation } from "@/actions/fileAnnotation";

interface VideoAnnotationProps {
  FileVersionId: string;
  src?: string;
  annotations: FileAnnotation[];
  setAnnotations: Dispatch<SetStateAction<FileAnnotation[]>>;
  showAnnotation?: string;
  creator: {
    name: string;
    profilePicture: string | null;
  }
  isCreator: boolean;
  className?: string;
}

export const VideoAnnotation : React.FC<VideoAnnotationProps> = ({ FileVersionId, src, annotations, setAnnotations, creator, className, showAnnotation, isCreator }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const addAnnotationRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<number>(0);
  const [timeStamp, setTimeStamp] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [openAnnotations, setOpenAnnotations] = useState<string[]>([]);
  const [hoveringAnnotation, setHoveringAnnotation] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [playerHeight, setPlayerHeight] = useState<number>(0);
  const [playerWidth, setPlayerWidth] = useState<number>(0);

  useEffect(() => {
    if (showAnnotation) {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
        const annotation = annotations.find(annotation => annotation.id === showAnnotation);
        videoRef.current.currentTime = annotation ? annotation.timeStamp / 100 : 0;
        setOpenAnnotations(prev => [...prev, showAnnotation]);
      }
    }
  }, [videoRef.current, showAnnotation]);

  useEffect(() => {
    if (playerRef.current) {
      setPlayerHeight(playerRef.current.clientHeight);
    }
  }, [playerRef.current?.clientHeight]);

  useEffect(() => {
    if (playerRef.current) {
      setPlayerWidth(playerRef.current.clientWidth);
    }
  }, [playerRef.current?.clientWidth]);
  
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCreator) return;
    e.preventDefault();
    setIsOpen(true);
    setPosition({ x: e.clientX, y: e.clientY });
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  useEffect(() => {
    if (videoRef.current?.duration !== undefined) {
      setDuration(videoRef.current.duration*100);
    }
  },[ videoRef.current?.duration ]);
  useEffect(() => {
    if (videoRef.current) {
      const handleTimeUpdate = () => {
        if (videoRef.current) {
          setTimeStamp(videoRef.current.currentTime * 100);
        }
      }
      const handleVideoEnd = () => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
      videoRef.current.addEventListener("ended", handleVideoEnd);
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }
  }, [videoRef.current]);

  return (
    <div
      className={`${className} relative`} ref={playerRef}
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
              if (videoRef.current) {
                videoRef.current.play();
                setIsPlaying(true);
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={async () => {
              setIsOpen(false)
              const x = (position.x - (playerRef.current?.getBoundingClientRect().left || 0)) / (playerRef.current?.clientWidth || 1);
              const y = (position.y - (playerRef.current?.getBoundingClientRect().top || 0)) / (playerRef.current?.clientHeight || 1);
              setAnnotations(prev => [...prev, 
                {
                  id: prev.length.toString(),
                  content: feedback,
                  x,
                  y,
                  resolved: false,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  timeStamp,
                  FileVersionId,
                }]);
              console.log("annotations", annotations);
              setFeedback("");
              if (videoRef.current) {
                videoRef.current.play();
                setIsPlaying(true);
              }
              await createFileAnnotation({FileVersionId, x, y, content: feedback, timeStamp});
            }}
          >
            Save
          </Button>
        </div>
      </div>
      <video src={src} className="w-full h-full -z-[10]" ref={videoRef}/>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute left-0 bottom-0 w-full h-12 flex flex-col justify-between items-start bg-black/20">
          <Slider
            className="w-[98%] relative left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out"
            max={duration}
            value={[timeStamp]}
            onValueChange={([e]) => {
              if (videoRef.current) {
                videoRef.current.currentTime = e/100;
                setTimeStamp(e);
              }
            }}
          />
          {annotations.map((annotation, index) => (
            <div key={index}>
              <div
                className="absolute top-1 w-3 h-3 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(duration + 98*annotation.timeStamp)/(duration)}%`,
                }}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = annotation.timeStamp/100;
                    setTimeStamp(annotation.timeStamp);
                  }
                }}
                onMouseEnter={() => {
                  console.log("hovering", annotation.id);
                  setHoveringAnnotation(annotation.id)
                }}
                onMouseLeave={() => {
                  console.log("leaving", annotation.id);
                  setHoveringAnnotation(null)
                }}
              />
              <Tooltip key={playerWidth} annotation={annotation} duration={duration} hoveringAnnotation={hoveringAnnotation} playerWidth={playerWidth}/>
            </div>
          ))}
          <div className="w-full flex justify-between items-center">
            <div className="flex justify-center items-center gap-2">
              <div
                className="p-1 h-fit ml-5 cursor-pointer"
                onClick={() => {
                  if (videoRef.current) {
                    if (videoRef.current.paused) videoRef.current.play();
                    else videoRef.current.pause();
                    setIsPlaying(prev => !prev);
                  }
                }}
              >
                {isPlaying ? <Pause color="white" className="fill-primary h-7 w-7"/> : <Play color="white" className="fill-primary h-7 w-7"/>}
              </div>
              <div
                className="p-1 h-fit cursor-pointer"
                onClick={() => {
                  if (videoRef.current) {
                    if (videoRef.current.muted) videoRef.current.muted = false;
                    else videoRef.current.muted = true;
                    setMuted(prev => !prev);
                  }
                }}
              >
                {muted ? <VolumeOff color="white" className="fill-primary h-7 w-7"/> : <Volume2 color="white" className="fill-primary h-7 w-7"/>}
              </div>
              <p className="text-white text-sm">{formatTime(timeStamp)} / {formatTime(duration)}</p>
            </div>
            <div
              className="p-1 h-fit cursor-pointer mr-5"
              onClick={() => {
                if (playerRef.current) {
                  if (isFullscreen) {
                    document.exitFullscreen();
                  } else {
                    playerRef.current.requestFullscreen();
                  }
                  setIsFullscreen(prev => !prev);
                }
              }}
            >
              {!isFullscreen ? <Fullscreen color="white" className="fill-primary h-7 w-7"/> : <Minimize color="white" className="fill-primary h-7 w-7"/>}
            </div>
          </div>          
        </div>
      </div>
      {annotations.map((annotation, index) => (
        <div key={index}>
          <div
            className={`absolute w-5 h-5 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 ${Math.abs(timeStamp - annotation.timeStamp) < 100 ? "flex " : "hidden"} justify-center items-center cursor-pointer`}
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
          <Annotation key={playerHeight+playerWidth} annotation={annotation} playerHeight={playerHeight} playerWidth={playerWidth} creator={creator} timeStamp={timeStamp} openAnnotations={openAnnotations} setOpenAnnotations={setOpenAnnotations}/>
        </div>
      ))}
    </div>
  )
}