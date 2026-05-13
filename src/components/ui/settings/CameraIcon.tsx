"use client";

// ************************ Ui Imports *************************
// => Ready To Use Components
import { Input } from "@/components/shadcn/input";

// => Icons
import { BiSolidCamera } from "react-icons/bi";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useRef } from "react";

// => My Custom Hooks
import { useUpdateAvatar } from "@/hooks/user/useUpdateAvatar";
import { useUploadFiles } from "@/hooks/useUploadFiles";

function CameraIcon() {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // => Use Hooks
  const { updateAvatarFetchFunc } = useUpdateAvatar();
  const { uploadFilesFunc } = useUploadFiles();

  // => Functions
  // --- Open Input File ---
  const handleClickIcon = () => {
    inputRef.current?.click();
  };

  const handleOnChange = async (files: FileList) => {
    // Get Url From Image
    const values = await uploadFilesFunc({
      files: files,
    });

    // Update Profile Image
    await updateAvatarFetchFunc({
      url: "api/user/avatar",
      values: values[0],
    });
  };

  return (
    <div
      className="icon-box absolute z-2 bottom-0 right-1 w-6 h-6 bg-gray-400 rounded-circle flex items-center justify-center cursor-pointer"
      onClick={handleClickIcon}
    >
      <BiSolidCamera className="text-caption text-white" />

      <Input
        className="hidden"
        type="file"
        name="profile-image"
        ref={inputRef}
        onChange={(eve) => {
          if (eve.target.files) {
            handleOnChange(eve.target.files);
          }
        }}
      />
    </div>
  );
}

export default CameraIcon;
