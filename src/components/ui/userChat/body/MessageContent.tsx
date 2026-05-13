"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import HandleMedia from "./HandleMedia";
import ReplyMessageData from "./ReplyMessageData";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { Message } from "@/lib/types";
import { MyDropdownMenu } from "@/Data";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface MessageContentProps {
  userId: string;
  message: Message;
  handleScrollToReply: () => void;
  handleMessagePayload: () => MyDropdownMenu[];
}

function MessageContent({
  userId,
  message,
  handleScrollToReply,
  handleMessagePayload,
}: MessageContentProps) {
  return (
    <div
      className={`message-content w-fit flex flex-col gap-3 ${
        userId === message.sender_id
          ? "bg-[#4eac6d3b] self-end mr-6 ml-0"
          : "bg-white dark:bg-dark-bg self-start mr-0 ml-6"
      } p-4 rounded-8 shadow-message-box`}
    >
      {message.reply_to_id && (
        <div onClick={() => handleScrollToReply()}>
          <ReplyMessageData userId={userId} messageId={message.reply_to_id} />
        </div>
      )}

      {message.content && (
        <div>
          <p className="text-[15px] text-light-text dark:text-white">
            {message.content}
          </p>
        </div>
      )}

      {message.media_urls?.length && message.metadata?.length ? (
        <HandleMedia
          mediaUrls={message.media_urls}
          filesData={message.metadata}
          mediaMessageDropdwonMenu={handleMessagePayload()}
        />
      ) : null}
    </div>
  );
}

export default MessageContent;
