"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import BackButton from "./BackButton";
import PictureBadge from "@/components/common/PictureBadge";
import ChatHeadrLoading from "@/components/loading/ChatHeadrLoading";

// => Icons
import { BiSolidPhoneCall } from "react-icons/bi";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useCallback, useContext } from "react";

// => My Custom Hooks
import { useSupabaseChannel } from "@/hooks/useSupbaseChannel";

// => Contexts
import { VoiceCallContext } from "@/contexts/VoiceCallContext";

// => Libs & Utils
import { formatTimeFromISO } from "@/utils/formatTimeFromISO";
import { formatDateFromISO } from "@/utils/formatDateFromISO";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { UserInfo, ConversationId, PostgresChangePayload } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UserChatHeadrProps {
  isLoading: boolean;
  conversationId: ConversationId;
  friendData: UserInfo;
  handleFriendData: (data: UserInfo) => void;
}

function UserChatHeadr({
  isLoading,
  friendData,
  handleFriendData,
  conversationId,
}: UserChatHeadrProps) {
  // ******************* Inside The Component  *******************
  // => Use Contexts
  const { handleOutgoingCallData } = useContext(VoiceCallContext);

  // => Functions
  // --- Set Friend Info
  const handleCall = () => {
    handleOutgoingCallData({
      friendId: friendData.id,
      friendName: friendData.username,
      friendImage: friendData.profile_image,
      conversationId,
    });
  };

  const handleFriendUpdate = useCallback(
    (payload: PostgresChangePayload) => {
      handleFriendData({
        ...friendData,
        status: payload.new.status as "offline" | "online",
        last_seen: payload.new.last_seen as string,
      });
    },
    [handleFriendData, friendData],
  );

  const handleLastSeen = (lastSeenISO: string | null): string | null => {
    if (!lastSeenISO) return null;

    return formatDateFromISO(lastSeenISO) === formatDateFromISO("")
      ? "Last seen at " + formatTimeFromISO(lastSeenISO)
      : "Last seen at " + formatDateFromISO(lastSeenISO);
  };

  // Setup Supabase Real-timr Changes For Friend Status Updates
  useSupabaseChannel({
    channelName: "user-status",
    events: [
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
        filter: `id=eq.${friendData.id}`,
        callback: handleFriendUpdate,
      },
    ],
    enabled: !!friendData,
  });

  return (
    <div className="user-chat-headr bg-[#ffffff0d] dark:bg-[#2e2e2e80] min-h-20 p-4 flex items-center gap-2 border-b-2 dark:border-b border-b-solid border-b-[#eaeaf1] dark:border-b-gray">
      <BackButton />

      {isLoading ? (
        <ChatHeadrLoading />
      ) : (
        <div className="info flex-1 flex items-center gap-2">
          <PictureBadge
            name={friendData.username}
            srcImg={friendData.profile_image}
          />

          <div className="flex flex-col gap-1.5">
            <span className="name max-sm:text-button text-[18px] font-semibold text-light-text dark:text-dark-text capitalize">
              {friendData.username}
            </span>

            <span
              className={`status text-smallCaption ${friendData.status === "online" ? "text-main" : "text-light-description dark:text-dark-description"}`}
            >
              {friendData.status === "online"
                ? friendData.status
                : handleLastSeen(friendData.last_seen)}
            </span>
          </div>
        </div>
      )}

      <div className="actions flex items-center gap-4">
        <BiSolidPhoneCall
          className="text-[22px] cursor-pointer text-light-text dark:text-dark-text"
          onClick={handleCall}
        />
      </div>
    </div>
  );
}

export default UserChatHeadr;
