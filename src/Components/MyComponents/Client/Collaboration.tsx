"use client";

import { getFileAnnotations, resolveFileAnnotation } from "@/actions/fileAnnotation";
import { getThumbnailAnnotations, resolveThumbnailAnnotation } from "@/actions/thumbnailAnnotation";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { useEffect, useState } from "react";
import { ProfilePicture } from "../General/ProfilePicture";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/Components/ui/badge";
import { Clock } from "lucide-react";
import { VideoAnnotation } from "./VideoAnnotation";
import { formatTime } from "@/constants";
import { ImageAnnotation } from "./ImageAnnotation";

interface CollaborationProps {
  project: {
    title: string;
    creator: {
      name: string;
      profilePicture: string | null;
    }
    fileVersion: {
      id: string;
      version: number;
      name: string;
      url: string;
    }[];
    thumbnailVersion: {
      id: string;
      version: number;
      name: string;
      url: string;
    }[];
  };
  isCreator: boolean;
  fileVersion: string | null;
  thumbnailVersion: string | null;
}

enum AnnotationOn {
  VIDEO = "video",
  THUMBNAIL = "thumbnail",
}

export type FileAnnotation = {
  id: string;
  content: string;
  x: number;
  y: number;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
  timeStamp: number;
  FileVersionId: string;
}

export type ThumbnailAnnotation = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  x: number;
  y: number;
  resolved: boolean;
  ThumbnailVersionId: string;
}

const demoFileAnnotations: FileAnnotation[] = [
  {
    id: "0",
    content: "This is a demo annotation",
    x: 0.5,
    y: 0.5,
    resolved: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    timeStamp: 500,
    FileVersionId: "1",
  },
  {
    id: "1",
    content: "This is another demo annotation",
    x: 0.3,
    y: 0.3,
    resolved: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    timeStamp: 700,
    FileVersionId: "1",
  },
]

const demoThumbnailAnnotations: ThumbnailAnnotation[] = [
  {
    id: "0",
    content: "This is a demo annotation",
    x: 0.5,
    y: 0.5,
    resolved: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ThumbnailVersionId: "1",
  },
  {
    id: "1",
    content: "This is another demo annotation",
    x: 0.3,
    y: 0.3,
    resolved: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ThumbnailVersionId: "1",
  },
]

export const Collaboration: React.FC<CollaborationProps> = ({ project, fileVersion, thumbnailVersion, isCreator }) => {
  const [annotatingOn, setAnnotatingOn] = useState<AnnotationOn>(fileVersion ? AnnotationOn.VIDEO : AnnotationOn.THUMBNAIL);
  const [fileVersionId, setFileVersionId] = useState<string>(fileVersion || project.fileVersion[0].id);
  const [thumbnailVersionId, setThumbnailVersionId] = useState<string | undefined>(thumbnailVersion || project.thumbnailVersion?.[0].id);
  const [fileAnnotations, setFileAnnotations] = useState<FileAnnotation[]>([]);
  const [thumbnailAnnotations, setThumbnailAnnotations] = useState<ThumbnailAnnotation[]>([]);
  const [showAnnotation, setShowAnnotation] = useState<string>("");
  useEffect(() => {
    const fetchAnnotations = async () => {
      if (!fileVersionId) return;
      let annotations = await getFileAnnotations(fileVersionId);
      setFileAnnotations(annotations);
    }
    fetchAnnotations();
  }, [fileVersionId])
  useEffect(() => {
    const fetchAnnotations = async () => {
      if (!thumbnailVersionId) return;
      let annotations = await getThumbnailAnnotations(thumbnailVersionId);
      setThumbnailAnnotations(annotations);
    }
    fetchAnnotations();
  }, [thumbnailVersionId])
  return (
    <Card className="w-[90%] flex flex-col gap-4 justify-start items-start border-none shadow-none">
      <CardHeader className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-col justify-center items-start">
          <CardTitle className="text-4xl">{project.title}</CardTitle>
          <CardDescription className="text-lg">Collaboration Space</CardDescription>
        </div>
        <div className="flex flex-row gap-4 justify-center items-center">
          <Button
            variant={annotatingOn == AnnotationOn.VIDEO ? "default" : "outline"}
            onClick={() => setAnnotatingOn(AnnotationOn.VIDEO)}
          >Video</Button>
          <Button
            variant={annotatingOn == AnnotationOn.THUMBNAIL ? "default" : "outline"}
            onClick={() => setAnnotatingOn(AnnotationOn.THUMBNAIL)}
          >Thumbnail</Button>
          <Select
            value={annotatingOn == AnnotationOn.VIDEO ? fileVersionId : thumbnailVersionId}
            onValueChange={(e) => annotatingOn == AnnotationOn.VIDEO ? setFileVersionId(e) : setThumbnailVersionId(e)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Version" className="w-96"/>
            </SelectTrigger>
            <SelectContent>
              {annotatingOn == AnnotationOn.VIDEO ? project.fileVersion.map(({ id, version, name }) => (
                <SelectItem key={id} value={id}>{`v${version} - ${name}`}</SelectItem>
              )) : project.thumbnailVersion?.map(({ id, version, name }) => (
                <SelectItem key={id} value={id}>{`v${version} - ${name}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="w-full flex gap-4 justify-start items-start">
        <Card className="w-[70%]">
          <CardHeader>
            <CardTitle>{annotatingOn == AnnotationOn.VIDEO ? "Video" : "Thumbnail"} Annotations</CardTitle>
            <CardDescription>Annotations for {annotatingOn == AnnotationOn.VIDEO ? "video" : "thumbnail"} version - {annotatingOn == AnnotationOn.VIDEO ? project.fileVersion.find(({ id }) => id == fileVersionId)?.version : project.thumbnailVersion.find(({ id }) => id == thumbnailVersionId)?.version}</CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            {annotatingOn == AnnotationOn.VIDEO ? (
              <VideoAnnotation
                FileVersionId={fileVersionId}
                src={project.fileVersion.find(({ id }) => id == fileVersionId)?.url}
                annotations={fileAnnotations}
                setAnnotations={setFileAnnotations}
                creator={project.creator}
                showAnnotation={showAnnotation}
                isCreator={isCreator}
                className="w-full h-auto"
              />
            ) : (
              <ImageAnnotation
                ThumbnailVersionId={thumbnailVersionId || ""}
                src={project.thumbnailVersion.find(({ id }) => id == thumbnailVersionId)?.url}
                annotations={thumbnailAnnotations}
                setAnnotations={setThumbnailAnnotations}
                creator={project.creator}
                showAnnotation={showAnnotation}
                isCreator={isCreator}
                className="w-full h-auto"
              />
            )}
          </CardContent>
        </Card>
        <Card className="w-[30%]">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Quick access to annotations</CardDescription>
          </CardHeader>
          <CardContent className="">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="flex flex-col gap-4">
                {annotatingOn == AnnotationOn.VIDEO && fileAnnotations.length == 0 && (
                  <p className="text-lg text-gray-500">No annotations found</p>
                )}
                {annotatingOn == AnnotationOn.VIDEO && fileAnnotations.map(({ id, content, timeStamp, resolved, createdAt }) => (
                  <div key={id} className={`w-full flex justify-start items-start gap-2 p-4 border border-gray-200 rounded-lg ${!resolved ? "bg-muted/50" : ""}`}
                    onClick={() => {
                      setShowAnnotation(id);
                    }}
                  >
                    <ProfilePicture url={project.creator.profilePicture} name={project.creator.name}/>
                    <div className="space-y-2">
                      <div className="flex flex-row justify-start items-center">
                        <h3 className="text-lg">{project.creator.name}</h3>
                        <p className="text-xs text-gray-500 ml-2">{formatDistanceToNow(createdAt) == "less than a minute" ? "0 minute" : formatDistanceToNow(createdAt)} ago</p>
                      </div>
                      <p>{content}</p>
                      <Badge variant="outline" className="flex justify-center items-center w-fit font-bold">
                        <Clock size={16} className="mr-1"/>
                        <p>{formatTime(timeStamp)}</p>
                      </Badge>
                    </div>
                    {!isCreator && !resolved && <Button variant="ghost"
                      onClick={async (e) => {
                        e.stopPropagation();
                        setFileAnnotations(prev => prev.map(annotation => annotation.id == id ? { ...annotation, resolved: true } : annotation))
                        await resolveFileAnnotation(id)
                      }}
                    >Resolve</Button>}
                  </div>
                ))}
                {annotatingOn == AnnotationOn.THUMBNAIL && thumbnailAnnotations.length == 0 && (
                  <p className="text-lg text-gray-500">No annotations found</p>
                )}
                {annotatingOn == AnnotationOn.THUMBNAIL && thumbnailAnnotations.map(({ id, content, createdAt }) => (
                  <div key={id} className="w-full flex justify-start items-start gap-2 p-4 border border-gray-200 rounded-lg">
                    <ProfilePicture url={project.creator.profilePicture} name={project.creator.name}/>
                    <div className="space-y-2">
                      <div className="flex flex-row justify-start items-center">
                        <h3 className="text-lg">{project.creator.name}</h3>
                        <p className="text-xs text-gray-500 ml-2">{formatDistanceToNow(createdAt) == "less than a minute" ? "0 minute" : formatDistanceToNow(createdAt)} ago</p>
                      </div>
                      <p>{content}</p>
                    </div>
                    {!isCreator && <Button variant="ghost"
                      onClick={async (e) => {
                        e.stopPropagation();
                        setThumbnailAnnotations(prev => prev.map(annotation => annotation.id == id ? { ...annotation, resolved: true } : annotation))
                        await resolveThumbnailAnnotation(id)
                      }}
                    >Resolve</Button>}
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="active" className="flex flex-col gap-4">
                {annotatingOn == AnnotationOn.VIDEO && fileAnnotations.filter(({ resolved }) => !resolved).length == 0 && (
                  <p className="text-lg text-gray-500">No active annotations found</p>
                )}
                {annotatingOn == AnnotationOn.VIDEO && fileAnnotations.filter(({ resolved }) => !resolved).map(({ id, content, timeStamp, createdAt }) => (
                  <div key={id} className="w-full flex justify-start items-start gap-2 p-4 border border-gray-200 rounded-lg"
                    onClick={() => {
                      setShowAnnotation(id);
                    }}
                  >
                    <ProfilePicture url={project.creator.profilePicture} name={project.creator.name}/>
                    <div className="space-y-2">
                      <div className="flex flex-row justify-start items-center">
                        <h3 className="text-lg">{project.creator.name}</h3>
                        <p className="text-xs text-gray-500 ml-2">{formatDistanceToNow(createdAt) == "less than a minute" ? "0 minute" : formatDistanceToNow(createdAt)} ago</p>
                      </div>
                      <p>{content}</p>
                      <Badge variant="outline" className="flex justify-center items-center w-fit font-bold">
                        <Clock size={16} className="mr-1"/>
                        <p>{formatTime(timeStamp)}</p>
                      </Badge>
                    </div>
                    {!isCreator && <Button variant="ghost"
                      onClick={async (e) => {
                        e.stopPropagation();
                        setFileAnnotations(prev => prev.map(annotation => annotation.id == id ? { ...annotation, resolved: true } : annotation))
                        await resolveFileAnnotation(id)
                      }}
                    >Resolve</Button>}
                  </div>
                ))}
                {annotatingOn == AnnotationOn.THUMBNAIL && thumbnailAnnotations.filter(({ resolved }) => !resolved).length == 0 && (
                  <p className="text-lg text-gray-500">No active annotations found</p>
                )}
                {annotatingOn == AnnotationOn.THUMBNAIL && thumbnailAnnotations.filter(({ resolved }) => !resolved).map(({ id, content, createdAt }) => (
                  <div key={id} className="w-full flex justify-start items-start gap-2 p-4 border border-gray-200 rounded-lg">
                    <ProfilePicture url={project.creator.profilePicture} name={project.creator.name}/>
                    <div className="space-y-2">
                      <div className="flex flex-row justify-start items-center">
                        <h3 className="text-lg">{project.creator.name}</h3>
                        <p className="text-xs text-gray-500 ml-2">{formatDistanceToNow(createdAt) == "less than a minute" ? "0 minute" : formatDistanceToNow(createdAt)} ago</p>
                      </div>
                      <p>{content}</p>
                    </div>
                    {!isCreator && <Button variant="ghost"
                      onClick={async (e) => {
                        e.stopPropagation();
                        setThumbnailAnnotations(prev => prev.map(annotation => annotation.id == id ? { ...annotation, resolved: true } : annotation))
                        await resolveThumbnailAnnotation(id)
                      }}
                    >Resolve</Button>}
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="resolved" className="flex flex-col gap-4">
                {annotatingOn == AnnotationOn.VIDEO && fileAnnotations.filter(({ resolved }) => resolved).length == 0 && (
                  <p className="text-lg text-gray-500">No resolved annotations found</p>
                )}
                {annotatingOn == AnnotationOn.VIDEO && fileAnnotations.filter(({ resolved }) => resolved).map(({ id, content, timeStamp, createdAt }) => (
                  <div key={id} className="w-full flex justify-start items-start gap-2 p-4 border border-gray-200 rounded-lg"
                    onClick={() => {
                      setShowAnnotation(id);
                    }}
                  >
                    <ProfilePicture url={project.creator.profilePicture} name={project.creator.name}/>
                    <div className="space-y-2">
                      <div className="flex flex-row justify-start items-center">
                        <h3 className="text-lg">{project.creator.name}</h3>
                        <p className="text-xs text-gray-500 ml-2">{formatDistanceToNow(createdAt) == "less than a minute" ? "0 minute" : formatDistanceToNow(createdAt)} ago</p>
                      </div>
                      <p>{content}</p>
                      <Badge variant="outline" className="flex justify-center items-center w-fit font-bold">
                        <Clock size={16} className="mr-1"/>
                        <p>{formatTime(timeStamp)}</p>
                      </Badge>
                    </div>
                  </div>
                ))}
                {annotatingOn == AnnotationOn.THUMBNAIL && thumbnailAnnotations.filter(({ resolved }) => resolved).length == 0 && (
                  <p className="text-lg text-gray-500">No resolved annotations found</p>
                )}
                {annotatingOn == AnnotationOn.THUMBNAIL && thumbnailAnnotations.filter(({ resolved }) => resolved).map(({ id, content, createdAt }) => (
                  <div key={id} className="w-full flex justify-start items-start gap-2 p-4 border border-gray-200 rounded-lg">
                    <ProfilePicture url={project.creator.profilePicture} name={project.creator.name}/>
                    <div className="space-y-2">
                      <div className="flex flex-row justify-start items-center">
                        <h3 className="text-lg">{project.creator.name}</h3>
                        <p className="text-xs text-gray-500 ml-2">{formatDistanceToNow(createdAt) == "less than a minute" ? "0 minute" : formatDistanceToNow(createdAt)} ago</p>
                      </div>
                      <p>{content}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}