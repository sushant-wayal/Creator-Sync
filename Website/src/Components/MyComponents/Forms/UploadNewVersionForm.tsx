"use client";

import { uploadNewVersion } from "@/actions/fileVersion";
import { completeInstruction } from "@/actions/instruction";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Checkbox } from "@/Components/ui/checkbox";
import { DialogFooter } from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { FileState, MultiFileDropzone } from "@/Components/ui/multi-file-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UploadNewVersionFormProps {
  projectId: string;
  instructions: {
    id: string;
    content: string;
    nature: "COMPULSORY" | "OPTIONAL";
  }[]
}

export const UploadNewVersionForm : React.FC<UploadNewVersionFormProps> = ({ projectId, instructions }) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
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
  const [instructionsStatues, setInstructionsStatues] = useState<("COMPLETED" | "PENDING")[]>(instructions.map(() => "PENDING"));
  const onSubmit = async () => {
    if (!fileUrl) {
      toast.error("Please upload a file before proceeding");
      return;
    }
    if (!instructionsStatues.includes("COMPLETED")) {
      toast.error("Please mark at least one instruction as complete before proceeding");
      return;
    }
    setSubmitting(true);
    const toastId = toast.loading("Uploading New Version...");
    try {
      await uploadNewVersion(projectId, fileUrl, fileName);
      await completeInstruction(instructions.filter((_, ind) => instructionsStatues[ind] === "COMPLETED").map(({ id }) => id), projectId);
      toast.success("New Version Uploaded Successfully", { id: toastId });
      router.refresh();
    } catch (error : any) {
      toast.error(`Error Uploading New Version. Try Again`, { id: toastId });
    }
    setSubmitting(false);
  }
  return (
    <div className="h-full flex flex-col justify-start gap-4 items-center w-full">
      <div className="w-full flex justify-center items-start gap-4 h-full">
        <Card className="border-gray-400 w-1/2">
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
                      setFileName(addedFileState.file.name);
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
        <Card className={`w-full border-gray-400 ${instructions.length == 0 ? "hidden" : ""}`}>
          <CardHeader>
            <CardTitle>Pending Instructions</CardTitle>
            <CardDescription>
              Mark instructions as complete to proceed.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full flex flex-col justify-start items-start gap-3 max-h-4/5 overflow-y-scroll">
            {instructions.map(({ id, content, nature }, ind) => (
              <div key={id} className="w-full flex justify-start items-center gap-2">
                <Checkbox
                  id={`instruction-${id}`}
                  checked={instructionsStatues[ind] === "COMPLETED"}
                  onCheckedChange={(e) => {
                    if (e) {
                      setInstructionsStatues((prev) => {
                        const newInstructionsStatues = structuredClone(prev);
                        newInstructionsStatues[ind] = "COMPLETED";
                        return newInstructionsStatues;
                      });
                    } else {
                      setInstructionsStatues((prev) => {
                        const newInstructionsStatues = structuredClone(prev);
                        newInstructionsStatues[ind] = "PENDING";
                        return newInstructionsStatues;
                      });
                    }
                  }}
                />
                <Label className="w-full" htmlFor={`instruction-${id}`}>
                  <div className="w-full flex gap-1 items-center justify-between">
                    <p>{content}</p>
                    <Badge
                      className="w-fit"
                      variant={nature === "COMPULSORY" ? "default" : "secondary"}
                    > 
                      {nature}
                    </Badge>
                  </div>
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <DialogFooter className="p-0">
        <Button onClick={onSubmit} disabled={submitting} className="flex justify-center items-center gap-2">
          {submitting ?
            <>
              <Loader className="animate-spin" size={20} />
              <p>Uploading...</p>
            </>
            :
            "Upload New Version"
          }
        </Button>
      </DialogFooter>
    </div>
  )
}