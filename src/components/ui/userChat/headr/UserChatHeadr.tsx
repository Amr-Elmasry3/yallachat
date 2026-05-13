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
import { useCallback, useContext, useState, useEffect } from "react";

// => My Custom Hooks
import { useSupabaseChannel } from "@/hooks/useSupbaseChannel";

// => Contexts
import { VoiceCallContext } from "@/contexts/VoiceCallContext";

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

  // => States & Refs
  const [localFriend, setLocalFriend] = useState(friendData);

  useEffect(() => {
    setLocalFriend(friendData);
  }, [friendData]);

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

  const handleLastSeen = (lastSeenISO: string | null): string | undefined => {
    if (!lastSeenISO) return;

    const last = new Date(lastSeenISO);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - last.getTime()) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return "Online";
    if (diffMinutes < 60) return `Last seen ${diffMinutes} minutes ago`;
    if (diffHours < 24) return `Last seen ${diffHours} hours ago`;
    if (diffDays === 1) return "Last seen yesterday";
    return `Last seen on ${last.toLocaleDateString()}`;
  };

  // Setup Supabase Real-timr Changes For Friend Status Updates
  useSupabaseChannel({
    channelName: `user-status-${localFriend.id}`,
    events: [
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
        filter: `id=eq.${localFriend.id}`,
        callback: handleFriendUpdate,
      },
    ],
    enabled: !!localFriend?.id,
  });

  return (
    <div className="user-chat-headr sticky top-0 bg-[#ffffff0d] dark:bg-[#2e2e2e80] min-h-20 p-4 flex items-center gap-2 border-b-2 dark:border-b border-b-solid border-b-[#eaeaf1] dark:border-b-gray">
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
