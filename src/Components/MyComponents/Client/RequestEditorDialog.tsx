"use client";

import { Input } from "@/Components/ui/input";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { ProfilePicture } from "../General/ProfilePicture";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { requestEditor } from "@/actions/requestEditor";

interface Editor {
  id: string;
  name: string;
  username: string;
  profilePicture: string | null;
  skills: string[];
  rating: number;
  editedProjects: { deadline: Date }[];
  _count: { editedProjects: number };
}

interface RequestEditorDialogProps {
  projectId: string;
  allEditors: Editor[];
}

export const RequestEditorDialog : React.FC<RequestEditorDialogProps> = ({ projectId, allEditors }) => {
  const [editors, setEditors] = useState<Editor[]>(allEditors);
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (search === "") {
      setEditors(allEditors);
    } else {
      setEditors(allEditors.filter(editor => editor.name.toLowerCase().includes(search.toLowerCase()) || editor.username.toLowerCase().includes(search.toLowerCase()) || editor.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))));
    }
  }, [search]);
  return (
    <div className="w-full space-y-4">
      <div className="w-full relative">
        <Search className="absolute top-2 left-2" />
        <Input
          className="pl-10"
          placeholder="Search by name, username or skill"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <ScrollArea className="mt-4 h-96">
        {editors.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p>No editors found</p>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {editors.map(({ id, profilePicture, name, rating, _count : { editedProjects }, skills }) => (
              <div key={id} className="w-full rounded-lg border-[1px] border-gray-200 p-4 flex justify-between items-center">
                <div className="flex justify-center items-center gap-3">
                  <ProfilePicture url={profilePicture} name={name} />
                  <div className="space-y-2">
                    <p className="font-semibold">{name}</p>
                    <div className="flex gap-3 justify-center items-center text-gray-500 font-[450] text-sm">
                      <div className="flex gap-2 justify-center items-center">
                        <Star size={18} color="black" className="fill-primary"/>
                        <p>{Number(rating.toFixed(1))}</p>
                      </div>
                      <p>.</p>
                      <p>{editedProjects} Project{editedProjects > 1 ? "s" : ""} edited</p>
                    </div>
                    <div className="flex gap-2 justify-start items-center">
                      {skills.slice(0, 3).map((skill) => (
                        <Badge variant="secondary" className="w-fit text-xs font-semibold">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  className="flex justify-center gap-2 items-center"
                  onClick={() => requestEditor(projectId, id)}
                >Request</Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
};