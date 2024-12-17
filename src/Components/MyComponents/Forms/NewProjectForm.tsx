"use client";

import { Editor, getSearchEditors } from "@/actions/editor";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { FileState, MultiFileDropzone } from "@/Components/ui/multi-file-dropzone";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { useEdgeStore } from "@/lib/edgestore";
import { NewProjectFormSchema } from "@/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {useForm } from "react-hook-form";
import { z } from "zod";
import { ProfilePicture } from "../ProfilePicture";
import { Badge } from "@/Components/ui/badge";
import { CalendarIcon, Plus, Search, X } from "lucide-react";
import { Switch } from "@/Components/ui/switch";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import { createProject } from "@/actions/project";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/Components/ui/calendar";

interface NewProjectFormProps {
  initialEditors: Editor[];
}

interface Instructions {
  nature: "COMPULSORY" | "OPTIONAL";
  content: string;
}

export const NewProjectForm : React.FC<NewProjectFormProps>  = ({ initialEditors }) => {
  const projectTypes = [
    { value: "VLOG", label: "Vlog" },
    { value: "SHORT_FILM", label: "Short Film" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "MUSIC_VIDEO", label: "Music Video" },
    { value: "DOCUMENTARY", label: "Documentary" }
  ];
  const [editors, setEditors] = useState<Editor[]>(initialEditors);
  const [selectedEditorId, setSelectedEditorId] = useState<string | null>(null);
  const [editorSearch, setEditorSearch] = useState<string>("");
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (editorSearch.length === 0) setEditors(initialEditors);
      else setEditors(await getSearchEditors(editorSearch));
    }, 500);
    return () => clearTimeout(timeout);
  }, [editorSearch]);
  const [instructionContent, setInstructionContent] = useState<string>("");
  const [instructionNature, setInstructionNature] = useState<"COMPULSORY" | "OPTIONAL">("OPTIONAL");
  const [instructions, setInstructions] = useState<Instructions[]>([]);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [fileUrl, setFileUrl] = useState<string>("");
  const { edgestore } = useEdgeStore();
  function updateFileProgress(key: string, progress: FileState['progress']) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }
  const form = useForm<z.infer<typeof NewProjectFormSchema>>({
    resolver: zodResolver(NewProjectFormSchema)
  });
  const onSubmit = async (values: z.infer<typeof NewProjectFormSchema>) => {
    toast.loading("Creating Project...");
    try {
      const { title, description, projectType, duration, deadline } = values;
      await createProject({
        title,
        description,
        type: projectType,
        editorId: selectedEditorId,
        fileUrl,
        duration,
        deadline,
        instructions: instructions.map(({ content, nature }) => ({ content, nature }))
      })
      toast.success("Project Created Successfully");
    } catch (err) {
      toast.error("Failed to create project");
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 w-full"
      >
        <Card className="border-gray-400">
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Upload your raw footage or other project file here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <MultiFileDropzone
              value={fileStates}
              className="h-80 w-full"
              onChange={(files) => {
                setFileStates(files);
              }}
              dropzoneOptions={{
                maxFiles: 1
              }}
              onFilesAdded={async (addedFiles) => {
                setFileStates([...fileStates, ...addedFiles]);
                await Promise.all(
                  addedFiles.map(async (addedFileState) => {
                    try {
                      const { url } = await edgestore.publicFiles.upload({
                        file: addedFileState.file,
                        onProgressChange: async (progress) => {
                          updateFileProgress(addedFileState.key, progress);
                          if (progress === 100) {
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                            updateFileProgress(addedFileState.key, 'COMPLETE');
                          }
                        },
                      });
                      console.log(url);
                      setFileUrl(url);
                    } catch (err) {
                      updateFileProgress(addedFileState.key, 'ERROR');
                    }
                  }),
                );
              }}
            />
          </CardContent>
        </Card>
        <Card className="border-gray-400">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Provide information about your new project
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-start gap-4 w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Project Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Project Name"
                      {...field}
                      className="placeholder:text-[#444444]"
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Project Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project"
                      {...field}
                      className="placeholder:text-[#444444]"
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Project Type
                  </FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-white placeholder:text-[#444444] text-black">
                        <SelectValue placeholder="Select Project Type"/>
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Duration
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Project Duration"
                      {...field}
                      className="placeholder:text-[#444444]"
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel>
                    Deadline
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            "Pick a date"
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card className="border-gray-400">
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex flex-col items-start justify-center gap-2">
              <CardTitle>Select Editor</CardTitle>
              <CardDescription>
                Choose an editor for your project
              </CardDescription>
            </div>
            <div className="flex flex-row items-center gap-2 border-[1px] rounded-lg px-1">
              <Search className="w-5 h-5"/>
              <Input  className="w-full border-0 py-0"
                placeholder="Search Editors"
                value={editorSearch}
                onChange={(e) => setEditorSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className={`grid ${editors.length > 0 ? "grid-cols-2" : "grid-cols-1"} gap-4 w-full`}>
            {editors.length === 0 && (
              <Card className="border-0">
                <CardContent className="flex flex-col items-center justify-center">
                  <CardTitle>No Editors Found</CardTitle>
                  <CardDescription>
                    No editors found for the search query
                  </CardDescription>
                </CardContent>
              </Card>
            )}
            {editors.map(({ id, name, profilePicture, rating, totalProjects }) => (
              <Card
                key={id}
                className={`${selectedEditorId == id ? "bg-gradient-to-br from-[#bbbbbb] to-white" : ""} "border-gray-400" cursor-pointer`}
                onClick={() => {
                  if (selectedEditorId != id) setSelectedEditorId(id)
                  else setSelectedEditorId(null)
                }}
              >
                <CardHeader className="flex flex-row justify-start gap-3 items-center pb-3 pt-2">
                  <ProfilePicture url={profilePicture} name={name}/>
                  <div className="flex flex-col justify-center items-start">
                    <CardTitle className="font-medium text-lg">{name}</CardTitle>
                    <CardDescription>
                      {totalProjects || "No"} projects edited
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <Badge variant="secondary">{Number(rating.toFixed(1))} / 5</Badge>
                  {selectedEditorId === id && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </Card>
        <Card className="border-gray-400">
          <CardHeader>
            <CardTitle>Instructions for Editor</CardTitle>
            <CardDescription>
              Add any specific instructions for the editor
            </CardDescription>
            <CardContent className="w-full px-0 pt-4">
              <div className="flex items-center gap-2 w-full">
                <Input
                  placeholder="Add Instructions"
                  className="w-3/5 flex-grow"
                  value={instructionContent}
                  onChange={(e) => setInstructionContent(e.target.value)}
                />
                <Switch
                  id="instruction-nature"
                  onCheckedChange={(checked) => setInstructionNature(checked ? "COMPULSORY" : "OPTIONAL")}
                />
                <Label htmlFor="instruction-nature">Compulsory</Label>
                <Button type="button" className="text-white rounded-md p-2"
                  onClick={() => {
                    if (instructionContent.length > 0) setInstructions([...instructions, {
                      nature: instructionNature,
                      content: instructionContent
                    }]);
                    setInstructionContent("");
                  }}
                >
                  <Plus className="w-5 h-5"/>
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                {instructions.map(({ nature, content }, index) => (
                  <div key={index} className="bg-gray-300 border-[1px] rounded-lg flex flex-row gap-4 justify-between items-center p-2">
                    <p className="flex-grow p-1">{content}</p>
                    <div className="flex gap-1 items-center">
                      <Badge variant={nature === "COMPULSORY" ? "default" : "secondary"} className="">
                        {nature === "COMPULSORY" ? "Compulsory" : "Optional"}
                      </Badge>
                      <Button
                        variant={"destructive"}
                        type="button"
                        className="p-1 h-7"
                        onClick={() => {
                          setInstructions(instructions.filter((_, i) => i !== index));
                        }}
                      >
                        <X className="w-5 h-5"/>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CardHeader>
        </Card>
        <Button type="submit" className="text-white rounded-md p-2 w-full">
          Create Project
        </Button>
      </form>
    </Form>
  )
}