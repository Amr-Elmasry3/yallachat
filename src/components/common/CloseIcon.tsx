"use client";

// ************************ Ui Imports *************************
// => Icons
import { BsX } from "react-icons/bs";

// ***************** My Custom Types & Variables *****************
// => Types & Interfaces
interface CloseIconProps {
  handleClose: () => void;
}

function CloseIcon({ handleClose }: CloseIconProps) {
  return (
    <div
      className="absolute right-3 top-3 bg-main hover:bg-dark-main w-6 h-6 rounded-circle flex items-center justify-center cursor-pointer my-transition"
      onClick={handleClose}
    >
      <BsX className="text-subHeading text-white" />
    </div>
  );
}

export default CloseIcon;
