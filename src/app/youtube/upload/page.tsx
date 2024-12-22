"use client";

import { auth } from '@/auth';
import { FileState, MultiFileDropzone } from '@/Components/ui/multi-file-dropzone';
import { useEdgeStore } from '@/lib/edgestore';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UploadPage() {
  const [authUrl, setAuthUrl] = useState('');
  const accessToken = useSearchParams().get('access_token') || '';
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  useEffect(() => {
    const authenticate = async () => {
      const session = await auth();
      if (session) {
        setProfilePicture(session.user.profilePicture);
      }
    }
    authenticate();
  }, []);

  // Fetch the authentication URL
  const getAuthUrl = async () => {
    const response = await fetch('/api/youtube/authenticate');
    const data = await response.json();
    setAuthUrl(data.authUrl);
  };
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('accessToken', accessToken);
    if (file) {
      formData.append('video', file);
    }
    formData.append('title', title);
    formData.append('description', description);

    const response = await axios.post('/api/youtube/upload', {
      accessToken,
      videoUrl: fileUrl,
      thumbnailUrl: profilePicture,
      title,
      description
    });

    const data = response.data;
    if (data.videoId) {
      alert(`Video uploaded! ID: ${data.videoId}`);
    } else {
      alert('Video upload failed');
    }
  };

  return (
    <div>
      <h1>Upload Video to YouTube</h1>
      <p>{profilePicture}</p>
      {!accessToken ? (
        <>
          <button onClick={getAuthUrl}>Authenticate with YouTube</button>
          {authUrl && <a href={authUrl}>Sign in to YouTube</a>}
        </>
      ) : (
        <form onSubmit={handleSubmit}>
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
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Video Title"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Video Description"
            required
          />
          <button type="submit">Upload</button>
        </form>
      )}
    </div>
  );
}
