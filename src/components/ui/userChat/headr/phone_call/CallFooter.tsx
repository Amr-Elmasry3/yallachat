// ************************ Ui Imports *************************
// => Icons
import { MdCallEnd, MdCall } from "react-icons/md";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface CallFooterProps {
  friendName: string;
  showAnswerButton: boolean;
  onAnswer: () => void;
  onEndOrReject: () => void;
}

function CallFooter({
  friendName,
  showAnswerButton,
  onAnswer,
  onEndOrReject,
}: CallFooterProps) {
  return (
    <div className="relative w-full bg-dark-main flex flex-col items-center gap-5 pt-12 pb-6 mt-5">
      <div className="absolute top-0 translate-y-[-50%] flex items-center gap-10">
        {showAnswerButton && (
          <span
            className="bg-main w-14 h-14 rounded-circle flex items-center justify-center cursor-pointer relative"
            onClick={onAnswer}
          >
            <span className="absolute inline-flex h-full w-full rounded-full bg-main opacity-75 animate-ping"></span>
            <span className="absolute inline-flex h-full w-full rounded-full bg-main opacity-40 animate-pulse"></span>
            <MdCall className="text-white text-2xl relative z-10" />
          </span>
        )}

        <span
          className="bg-danger w-14 h-14 rounded-circle flex items-center justify-center cursor-pointer"
          onClick={onEndOrReject}
        >
          <MdCallEnd className="text-white text-2xl" />
        </span>
      </div>

      <span className="text-gray-light font-medium">{friendName}</span>
    </div>
  );
}

export default CallFooter;
