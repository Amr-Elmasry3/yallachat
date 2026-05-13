"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import HandleMediaTypes from "./media_types/HandleMediaTypes";
import MediaCarousel from "./MediaCarousel";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useState } from "react";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { UrlFile, FileData } from "@/lib/types";
import { MyDropdownMenu } from "@/Data";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
export interface HandleMediaProps {
  mediaUrls: UrlFile[];
  filesData: FileData[];
  mediaMessageDropdwonMenu: MyDropdownMenu[];
}

function HandleMedia({
  mediaUrls,
  filesData,
  mediaMessageDropdwonMenu,
}: HandleMediaProps) {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [isCarousel, setIsCarousel] = useState<boolean>(false);

  // => Functions
  const handleIsCarousel = () => {
    setIsCarousel(!isCarousel);
  };

  return (
    <div className="handle-media relative">
      <ul className="flex flex-col items-center gap-3">
        {mediaUrls.slice(0, 2).map((item, index) => {
          return (
            <li
              className="relative max-w-65"
              key={filesData[index].fileName}
              onClick={() => {
                if (filesData[index].fileType === "image") handleIsCarousel();
              }}
            >
              <HandleMediaTypes
                mediaType={filesData[index].fileType}
                src={item as string}
                fileName={filesData[index].fileName}
                fileSize={filesData[index].fileSize}
                duration={filesData[index].duration}
              />
            </li>
          );
        })}
      </ul>

      {mediaUrls.length > 2 ? (
        <span
          className="absolute top-[50%] left-[50%] translate-[-50%] w-7 h-7 bg-dark-main rounded-circle flex items-center justify-center text-caption font-semibold text-white cursor-pointer"
          onClick={handleIsCarousel}
        >
          +{mediaUrls.length - 2}
        </span>
      ) : null}

      <MediaCarousel
        isCarousel={isCarousel}
        handleIsCarousel={handleIsCarousel}
        mediaUrls={mediaUrls}
        filesData={filesData}
        mediaMessageDropdwonMenu={mediaMessageDropdwonMenu}
      />
    </div>
  );
}

export default HandleMedia;
