"use client";

// ************************ Ui Imports *************************
// => My Custom Components
import UserChatHeadr from "./headr/UserChatHeadr";
import UserChatBody from "./body/UserChatBody";
import UserChatFooter from "./footer/UserChatFooter";
import { ErrorBoundary } from "@/components/error_boundary/ErrorBoundary";
import ErrorState from "@/components/error_boundary/ErrorState";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useEffect, useState, useCallback, useRef } from "react";

// => My Custom Hooks
import { useGetData } from "@/hooks/useGetData";
import { useUpdateMessageStatus } from "@/hooks/messages/useUpdateMessageStatus";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import {
  ConversationId,
  Message,
  UserInfo,
  ConversationDetails,
} from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface FoundChatProps {
  conversationId: ConversationId;
}

function FoundChat({ conversationId }: FoundChatProps) {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [messages, setMessages] = useState<Message[]>([]);
  const [friendData, setFriendData] = useState<UserInfo>({} as UserInfo);
  const [userData, setUserData] = useState<UserInfo>({} as UserInfo);
  const [convId, setConvId] = useState<number>(0);

  const hasUpdatedMessagesRef = useRef(false);

  // => Use Hooks
  const { getDataFetchFunc, isLoading, isError, statusNum } =
    useGetData<ConversationDetails>();
  const { updateMessageStatusFunc } = useUpdateMessageStatus();

  // => Functions
  const handleMessages = useCallback(
    (newMessages: Message[] | ((prev: Message[]) => Message[])): void => {
      if (typeof newMessages === "function") {
        setMessages((prevMessages) => {
          const updated = newMessages(prevMessages);
          // Reset Ref To Allow Seen Update For Newly Arrived Messages
          // Only Reset If The Message Count Increased (New Messages Arrived)
          if (updated.length > prevMessages.length) {
            hasUpdatedMessagesRef.current = false;
          }
          return updated;
        });
      } else {
        setMessages(newMessages);
      }
    },
    [],
  );

  const handleFriendData = (data: UserInfo): void => {
    setFriendData(data);
  };

  // --- Update Messages Status To "Seen" ---
  const updateMessagesToSeen = useCallback(async () => {
    if (!convId || !userData.id || messages.length === 0) return;

    await updateMessageStatusFunc({
      status: "seen",
      conversationId: convId,
      userId: userData.id,
    });

    // Update Local State To Mark Messages As Seen
    handleMessages((prevMessages: Message[]) =>
      prevMessages.map((msg: Message) => {
        // Only Mark Messages That Are NOT From The Current User As Seen
        if (
          msg.sender_id !== userData.id &&
          (msg.status === "sent" || msg.status === "delivered")
        ) {
          return { ...msg, status: "seen" as const };
        }
        return msg;
      }),
    );
  }, [
    convId,
    userData.id,
    messages.length,
    handleMessages,
    updateMessageStatusFunc,
  ]);

  // Callback To Update Seen Status For New Messages From Friend
  const handleNewMessagesFromFriend = useCallback(() => {
    // Reset Ref To Allow Seen Update To Run Again
    hasUpdatedMessagesRef.current = false;

    updateMessagesToSeen();
  }, [updateMessagesToSeen]);

  // => Use Effects
  // --- Get Conversation Data And Set States ---
  useEffect(() => {
    hasUpdatedMessagesRef.current = false;

    const fetchCoversationData = async () => {
      const result = await getDataFetchFunc({
        url: `api/conversations/${conversationId}`,
      });

      if (result?.data.messages) {
        setMessages(result?.data.messages);
      }
      if (result?.data.friend) {
        setFriendData(result?.data.friend);
      }
      if (result?.data.user) {
        setUserData(result?.data.user);
      }
      if (result?.data.conversation.id) {
        setConvId(result?.data.conversation.id);
      }
    };

    fetchCoversationData();
  }, [conversationId, getDataFetchFunc]);

  // --- Update Messages To Seen When Conversation Loads ---
  useEffect(() => {
    if (
      convId &&
      userData.id &&
      messages.length > 0 &&
      !hasUpdatedMessagesRef.current
    ) {
      hasUpdatedMessagesRef.current = true;
      updateMessagesToSeen();
    }
  }, [convId, userData.id, updateMessagesToSeen, messages.length]);

  if (isError) {
    return <ErrorState status={statusNum} />;
  }

  return (
    <div className="h-full flex flex-col max-sm:pb-12">
      <ErrorBoundary>
        <UserChatHeadr
          isLoading={isLoading}
          friendData={friendData}
          handleFriendData={handleFriendData}
          conversationId={conversationId}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <UserChatBody
          messages={messages}
          userData={userData}
          friendData={friendData}
          conversationId={conversationId}
          handleMessages={handleMessages}
          onNewMessagesFromFriend={handleNewMessagesFromFriend}
        />
      </ErrorBoundary>

      <UserChatFooter
        conversationId={convId}
        userId={userData.id}
        username={userData.username}
        userImage={userData.profile_image}
        friendId={friendData.id}
      />
    </div>
  );
}

export default FoundChat;
