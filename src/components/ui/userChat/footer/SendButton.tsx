"use client";

// ************************ Ui Imports *************************
// => Ready To Use Components
import { Spinner } from "@/components/shadcn/spinner";

// => My Custom Components
import PopupHover from "@/components/common/PopupHover";

// => Icons
import { BiSend } from "react-icons/bi";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface SendButtonProps {
  avaiableSend: boolean;
  isLoading: boolean;
  handleClick: () => void;
}

function SendButton({ avaiableSend, isLoading, handleClick }: SendButtonProps) {
  return (
    <button
      className={`send-button relative group min-w-10 h-8.5 bg-main hover:bg-dark-main flex items-center justify-center rounded-8 ${avaiableSend ? "opacity-[1] cursor-pointer" : "opacity-[0.4] cursor-not-allowed"} my-transition`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner className="text-white" />
      ) : (
        <BiSend className="text-subHeading text-white" />
      )}

      <PopupHover title="Send" direction="top" />
    </button>
  );
}

export default SendButton;
