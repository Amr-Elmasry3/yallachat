"use client";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useCloudinaryUpload } from "./useCloudinaryUpload";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { FileValues } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UploadFilesFunc {
  files: FileList | [];
}
interface UseUploadFilesReturn {
  loading: boolean;
  uploadFilesFunc: (
    config: UploadFilesFunc,
  ) => Promise<(FileValues | undefined)[]>;
}

export function useUploadFiles(): UseUploadFilesReturn {
  // ******************* Inside Hook  *******************
  // => Use Hooks
  const { loading, uploadFile } = useCloudinaryUpload();

  // => Functions
  const uploadFilesFunc = async (
    config: UploadFilesFunc,
  ): Promise<(FileValues | undefined)[]> => {
    if (!config.files || config.files.length === 0) {
      return [];
    }

    // Convert File List To Array Then Use Map With Promise.all
    const filesArray = Array.from(config.files);

    const promises = filesArray.map(
      async (file: File): Promise<FileValues | undefined> => {
        const result = await uploadFile({ file, fileName: file.name });

        if (result) {
          return {
            urlFile: result.url,
            fileSize: file.size,
            fileType: file.type.slice(0, file.type.indexOf("/")),
            fileName: file.name,
            duration: result.duration,
          };
        }
      },
    );

    // Wait Promises...
    const values = await Promise.all(promises);

    return values;
  };

  return { loading, uploadFilesFunc };
}
