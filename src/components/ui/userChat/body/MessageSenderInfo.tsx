// ************************ Ui Imports *************************
// => My Custom Components
import PictureBadge from "@/components/common/PictureBadge";
import MessageStatus from "./MessageStatus";

// *********************** Logic Imports ***********************
// => Libs & Utils
import { formatTimeFromISO } from "@/utils/formatTimeFromISO";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface MessageSenderInfoProps {
  userId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  messageStatus: "sent" | "delivered" | "seen";
  messageUpdate: string;
}

function MessageSenderInfo({
  userId,
  senderId,
  senderName,
  senderAvatar,
  messageStatus,
  messageUpdate,
}: MessageSenderInfoProps) {
  return (
    <div
      className={`sender-info flex items-center gap-2 ${
        userId === senderId
          ? "flex-row-reverse self-end"
          : "flex-row self-start"
      }`}
    >
      <PictureBadge
        name={senderName}
        srcImg={senderAvatar}
        width={6}
        height={6}
      />
      <span className="text-smallCaption font-semibold text-light-text dark:text-dark-text">
        {userId === senderId ? "You" : senderName}
      </span>
      <span className="text-smallCaption font-semibold text-light-description dark:text-dark-description">
        {formatTimeFromISO(messageUpdate)}
      </span>
      <MessageStatus status={messageStatus} />
    </div>
  );
}

export default MessageSenderInfo;
