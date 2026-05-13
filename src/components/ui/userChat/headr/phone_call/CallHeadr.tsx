// ************************ Ui Imports *************************
// => My Custom Components
import PictureBadge from "@/components/common/PictureBadge";

// *********************** Logic Imports ***********************
// => Libs & Utils
import { formatTimeFromSeconds } from "@/utils/formatTimeFromSeconds";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces

import { CallStatus } from "./types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface CallHeaderProps {
  friendImage: string | null;
  friendName: string;
  callStatus: CallStatus;
  callTime: number;
}

function CallHeader({
  friendImage,
  friendName,
  callStatus,
  callTime,
}: CallHeaderProps) {
  return (
    <>
      <div className="w-26 h-26">
        <PictureBadge
          name={friendName}
          srcImg={friendImage}
          width={26}
          height={26}
        />
      </div>

      <div className="mt-3 text-sm text-gray-500">
        {callStatus === "ringing" && "Calling..."}

        {callStatus === "in-call" && formatTimeFromSeconds(callTime)}
      </div>
    </>
  );
}

export default CallHeader;
