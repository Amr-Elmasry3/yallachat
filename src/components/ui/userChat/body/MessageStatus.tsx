// ************************ Ui Imports *************************
// => Icons
import { BiCheck } from "react-icons/bi";
import { BiCheckDouble } from "react-icons/bi";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface MessageStatusProps {
  status: "sent" | "delivered" | "seen";
}

function MessageStatus({ status }: MessageStatusProps) {
  switch (status) {
    case "sent":
      return (
        <BiCheck className="text-caption text-light-text dark:text-dark-text" />
      );
    case "delivered":
      return (
        <BiCheckDouble className="text-caption text-light-text dark:text-dark-text" />
      );
    case "seen":
      return <BiCheckDouble className="text-caption text-main" />;
    default:
      return null;
  }
}

export default MessageStatus;
