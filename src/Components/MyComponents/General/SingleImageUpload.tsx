import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { SingleImageDropzone } from "@/Components/ui/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { CheckCircle, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface SingleImageUploadProps {
  setUrl: Dispatch<SetStateAction<string | null>>;
  setName?: Dispatch<SetStateAction<string | null>>;
  height?: number;
  width?: number;
  buttonText?: string;
}

export const SingleImageUpload : React.FC<SingleImageUploadProps> = ({ setUrl, setName, height, width, buttonText }) => {
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File | undefined>(undefined);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const uploadImage = async (file : File) =>  {
    setUploading(true);
    const { url, thumbnailUrl } = await edgestore.publicImages.upload({
      file,
      onProgressChange: (progress) => {
        setUploadProgress(progress);
      }
    });
    setUploading(false);
    setUrl(thumbnailUrl || url);
    if (setName) setName(file.name);
    return thumbnailUrl || url;
  }
  return (
    <div className="flex flex-col items-center space-y-4">
      <SingleImageDropzone
        width={width || 200}
        height={height || 200}
        value={file}
        onChange={(file) => {
          setUploadProgress(0);
          setFile(file);
        }}
        className="border-2 border-dashed border-[#444444]"
      />
      {file && (
        uploadProgress < 100 ? (
        <div className="flex items-center gap-2 w-1/3">
          <Progress value={uploadProgress} className="w-full h-2" />
          <span>
            {Math.round(uploadProgress)}%
          </span>
        </div>
        ) : (
        <div className="flex justify-center items-center gap-2 w-1/2">
          <CheckCircle className="text-green-500" />
          <p className="text-center"> Profile Picture Uploaded </p>
        </div>
        )
      )}
      <Button
        type="button"
        disabled={uploading || !file || uploadProgress > 0}
        className="disabled:cursor-not-allowed bg-[#222222] rounded-full"
        onClick={async () => {
          if (file) await uploadImage(file);
        }}
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5" />
            <span className="ml-2">Uploading...</span>
          </>
        ) : (
          buttonText || "Upload Image"
        )}
      </Button>
    </div>
  )
}