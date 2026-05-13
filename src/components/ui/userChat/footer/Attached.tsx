"use client";

// ************************ Ui Imports *************************
// => Icons
import { BiPaperclip } from "react-icons/bi";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useRef } from "react";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface AttachedProps {
  handleSelectedFiles: (files: FileList) => void;
}

function Attached({ handleSelectedFiles }: AttachedProps) {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // => Functions
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (files: FileList) => {
    handleSelectedFiles(files);
  };

  return (
    <div className="attached">
      <BiPaperclip
        className="text-subHeading text-light-text dark:text-dark-text cursor-pointer"
        onClick={handleClick}
      />

      <input
        type="file"
        multiple
        className="hidden"
        ref={inputRef}
        onChange={(eve) => {
          if (eve.target.files) {
            handleChange(eve.target.files);
          }
        }}
      />
    </div>
  );
}

export default Attached;
