// *********************** Logic Imports ***********************
// => Libs & Utils
import { formatDateFromISO } from "@/utils/formatDateFromISO";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface MessageDateSeparatorProps {
  index: number;
  messageTime: string;
  prevMessageTime: string;
}

function MessageDateSeparator({
  index,
  messageTime,
  prevMessageTime,
}: MessageDateSeparatorProps) {
  // ******************* Inside The Component  *******************
  // => Functions
  const checkMessagesSameDate = (
    messageTime: string,
    prevMessageTime: string,
  ): boolean => {
    return (
      formatDateFromISO(messageTime) !== formatDateFromISO(prevMessageTime)
    );
  };

  const handleMessagesDate = (messageTime: string): string => {
    return formatDateFromISO(messageTime) === formatDateFromISO()
      ? "Today"
      : formatDateFromISO(messageTime);
  };

  return (
    index &&
    checkMessagesSameDate(messageTime, prevMessageTime) && (
      <div className="flex justify-center">
        <span className="bg-gray-300 dark:bg-gray text-[11px] text-light-description dark:text-dark-text p-1.5 rounded-[6px]">
          {handleMessagesDate(messageTime)}
        </span>
      </div>
    )
  );
}

export default MessageDateSeparator;
