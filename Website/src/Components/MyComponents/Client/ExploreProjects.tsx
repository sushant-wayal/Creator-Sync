"use client";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { cn } from "@/lib/utils";
import { ProjectType } from "@prisma/client";
import { format, formatDistanceToNow } from "date-fns";
import { CalendarIcon, CheckCircle, Clock, FileVideo, ListChecks, Search } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { useEffect, useState } from "react";
import { ProfilePicture } from "../General/ProfilePicture";
import { Badge } from "@/Components/ui/badge";
import Link from "next/link";

interface ExploreProjectsProps {
  initialProjects: {
    id: string;
    creator: {
      id: string;
      name: string;
      profilePicture: string | null;
      youtubeRefreshToken: string | null;
    }
    title: string;
    description: string;
    type: ProjectType;
    duration: number;
    deadline: Date;
    budget: number;
    _count: {
      requests: number;
      compulsoryInstructions: number;
      optionalInstructions: number;
    }
    updatedAt: Date;
  }[];
  readyToEdit: boolean;
}

export const ExploreProjects : React.FC<ExploreProjectsProps> = ({ initialProjects, readyToEdit }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ProjectType | "all" | undefined>(undefined);
  const [duration, setDuration] = useState<number | "all">("all");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [budget, setBudget] = useState<number | "all">("all");
  useEffect(() => {
    setProjects(initialProjects.filter(project => (
      (project.title.toLowerCase() + project.creator.name.toLowerCase() + project.description.toLowerCase()).includes(search.toLowerCase()) &&
      (!type || type === "all" || project.type === type) &&
      (duration === "all" || project.duration <= duration) &&
      (!deadline || project.deadline <= deadline) &&
      (budget === "all" || project.budget <= budget)
    )));
  }, [search, type, duration, deadline]);
  return (
    <div className="flex-grow w-full flex flex-col">
      <div className="w-full flex gap-4">
        <div className="relative flex-grow">
          <Search className="w-5 h-5 absolute top-2 left-2"/>
          <Input  className="w-full py-2 pl-9"
            placeholder="Search projects"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={type}
          onValueChange={value => setType(value === "all" ? "all" : value as ProjectType)}
        >
          <SelectTrigger className="bg-white w-40">
            <SelectValue className="" placeholder="Type"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value={ProjectType.COMMERCIAL}>Commercial</SelectItem>
            <SelectItem value={ProjectType.DOCUMENTARY}>Documentary</SelectItem>
            <SelectItem value={ProjectType.MUSIC_VIDEO}>Music Video</SelectItem>
            <SelectItem value={ProjectType.SHORT_FILM}>Short Film</SelectItem>
            <SelectItem value={ProjectType.VLOG}>Vlog</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Duration"
          value={duration === "all" ? "" : duration}
          onChange={e => setDuration(e.target.value === "" ? "all" : parseInt(e.target.value))}
          className="w-40"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-40 pl-3 text-left font-normal",
                !deadline && "text-muted-foreground"
              )}
            >
              {deadline ? (
                format(deadline, "PPP")
              ) : (
                "Deadline"
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={deadline || undefined}
              onSelect={date => setDeadline(date || null)}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          type="number"
          placeholder="Budget"
          value={budget === "all" ? "" : budget}
          onChange={e => setBudget(e.target.value === "" ? "all" : parseInt(e.target.value))}
          className="w-40"
        />
      </div>
      <div className="flex-grow grid grid-cols-3 gap-4 mt-4">
        {projects.length === 0 && (
          <div className="w-[calc(100vw-64px)] h-full flex justify-center items-center text-gray-500 text-6xl">
            <p>No projects found</p>
          </div>
        )}
        {projects.map(({
          id,
          creator : {
            name,
            profilePicture,
            youtubeRefreshToken
           },
          title,
          description,
          type,
          duration,
          deadline,
          budget,
          _count: {
            requests,
            compulsoryInstructions,
            optionalInstructions
          },
          updatedAt
        }) => (
          <Link href={`/project/${id}`} key={id}>
            <div key={id} className="bg-white rounded-lg shadow-sm p-4 space-y-6 border-[1px] border-gray-200">
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ProfilePicture url={profilePicture} name={name} className="w-8 h-8 rounded-full"/>
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm text-gray-500">by {name}</span>
                      {youtubeRefreshToken && <CheckCircle color="black" className="w-4 h-4"/>}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">{type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</Badge>
              </div>
              <p className="w-full text-sm text-gray-500 mt-2">{description}</p>
              <div className="w-full grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Clock color="gray" className="w-4 h-4"/>
                  <span className="text-sm">{duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileVideo color="gray" className="w-4 h-4"/>
                  <span className="text-sm" suppressHydrationWarning>{deadline.getDay() - (new Date()).getDay()} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <ListChecks color="gray" className="w-4 h-4"/>
                  <span className="text-sm">{compulsoryInstructions} required, {optionalInstructions} optional</span>
                </div>
                <p className="text-sm text-gray-500" suppressHydrationWarning>{requests} request{requests > 0 ? "s" : ""}</p>
              </div>
              <hr className="w-full border-t border-gray-200 my-5"/>
              <div className="w-full flex justify-between items-center">
                <p className="text-sm text-gray-500" suppressHydrationWarning>
                  Posted {formatDistanceToNow(updatedAt)} ago
                </p>
                <span className="text-sm text-black">${budget}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}