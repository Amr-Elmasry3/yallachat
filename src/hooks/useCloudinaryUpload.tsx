"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useState } from "react";

// => My Custom Hooks
import { useAxiosError } from "./useAxiosError";

// => Libraries
import axios from "axios";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
type UploadFile = {
  file: File | Blob;
  fileName: string | "file";
};
interface UseCloudinaryUploadReturn {
  uploadFile: (config: UploadFile) => Promise<UploadFileReturn | undefined>;
  loading: boolean;
}
interface UploadFileReturn {
  url: string;
  duration?: number;
}

export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [loading, setLoading] = useState(false);

  // => Use Hooks
  const { handleAxiosError } = useAxiosError();

  // => Functions
  const uploadFile = async (
    config: UploadFile,
  ): Promise<UploadFileReturn | undefined> => {
    setLoading(true);

    try {
      const formData = new FormData();

      // Cloudinary Needs File Or Blob As Its "File".
      formData.append("file", config.file, config.fileName);

      // Very Important: Name Of Upload Preset
      formData.append("upload_preset", "yallachat-upload");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/yallachat/upload",
        formData,
      );

      const result = response.data;

      const duration =
        result.duration || result.resource?.duration || undefined;

      return { url: result.secure_url, duration };
    } catch (error: unknown) {
      handleAxiosError({ error });
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadFile,
    loading,
  };
}
