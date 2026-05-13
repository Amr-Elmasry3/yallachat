"use client";

// ************************ Ui Imports *************************
// => Ready To Use Components
import { Spinner } from "@/components/shadcn/spinner";

// => My Custom Components
import MyDropdown from "@/components/common/MyDropdown";
import MessageDateSeparator from "./MessageDateSeparator";
import MessageSenderInfo from "./MessageSenderInfo";
import MessageContent from "./MessageContent";
import ScrollToDown from "./ScrollToDown";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import React, { useEffect, useRef, useState } from "react";

// => My Custom Hooks
import { useMessagesSubscription } from "@/hooks/chat/useMessagesSubscription";
import { useMessagesScroll } from "@/hooks/chat/useMessagesScroll";
import { useMessageReply } from "@/hooks/chat/useMessageReply";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { Message, UserInfo, ConversationId } from "@/lib/types";
import { MyDropdownMenu } from "@/Data";

// => Varaiables
import { messagesChatDropdownMenu } from "@/Data";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UserChatBodyProps {
  messages: Message[];
  userData: UserInfo;
  friendData: UserInfo;
  conversationId: ConversationId;
  handleMessages: (
    newMessages: Message[] | ((prev: Message[]) => Message[]),
  ) => void;
  onNewMessagesFromFriend?: () => void;
}

function UserChatBody({
  messages,
  userData,
  friendData,
  conversationId,
  handleMessages,
  onNewMessagesFromFriend,
}: UserChatBodyProps) {
  // ******************* Inside The Component  *******************
  // => Use Contexts

  // => States & Refs
  const [newMessageCount, setNewMessagesCount] = useState<number>(0);

  // --- Refs for subscription hook ---
  const userDataRef = useRef(userData);
  const friendDataRef = useRef(friendData);

  // => Use Hooks
  const { showFlash, scrollToReply } = useMessageReply();
  const { messagesContainerRef, isLoading, isAtBottom } = useMessagesScroll({
    conversationId,
    messages,
    handleMessages,
  });

  // => Functions
  // --- Handle Payload For Each Message => [Dropdown Menu] ---
  const handleMessagePayload = (
    type: "text" | "media",
    payload: Message,
    userId: string,
  ): MyDropdownMenu[] => {
    let list: MyDropdownMenu[] = [];
    const isUserMessage: boolean = userId === payload.sender_id;

    switch (type) {
      case "text":
        list = messagesChatDropdownMenu.filter((item) => {
          return (
            item.title !== "download" &&
            (isUserMessage || item.title !== "delete")
          );
        });
        break;
      case "media":
        list = messagesChatDropdownMenu.filter((item) => {
          return (
            item.title !== "copy" && (isUserMessage || item.title !== "delete")
          );
        });
        break;
      default:
        break;
    }

    return list.map((item) => ({ ...item, payload }));
  };

  const handleScrollToReply = (replyToId: number | null) => {
    scrollToReply(messagesContainerRef.current, replyToId);
  };

  const handleNewMessageCount = () => {
    setNewMessagesCount((prev) => prev + 1);
  };

  // --- Messages Subscription Hook ---
  useMessagesSubscription({
    conversationId,
    userDataRef,
    friendDataRef,
    handleMessages,
    onNewMessagesFromFriend,
    handleNewMessageCount,
  });

  // => Use Effects
  // --- Update refs when data changes ---
  useEffect(() => {
    userDataRef.current = userData;
    friendDataRef.current = friendData;
  }, [userData, friendData]);

  return (
    <div
      ref={messagesContainerRef}
      className="user-chat-body relative p-4 flex flex-col gap-6 flex-1 overflow-y-scroll my-scrollbar"
      id="user-chat-body"
    >
      {/* Loading Older Messages */}
      {isLoading && (
        <p className="flex items-center justify-center gap-2 text-main">
          Older Messsages are Loading <Spinner />
        </p>
      )}

      {/* Loop Last 20 Messages */}
      {messages.map((message, index) => (
        <React.Fragment key={message.id}>
          {index ? (
            <MessageDateSeparator
              index={index}
              messageTime={message.created_at}
              prevMessageTime={messages[index - 1].created_at}
            />
          ) : null}

          {!message.is_deleted && (
            <li
              className={`relative group flex items-center gap-2.5 max-w-[85%] xxs:max-w-[70%] ${
                userData.id === message.sender_id
                  ? "flex-row-reverse self-end"
                  : "flex-row self-start"
              }`}
              id={`message-${message.id}`}
            >
              {showFlash === message.id && (
                <span className="absolute z-30 inset-0 bg-green-500/20 dark:bg-green-400/20 w-full h-full p-2 rounded-8 my-transition"></span>
              )}

              <div className="message-box flex flex-col gap-2.5">
                {/* Message Content */}
                <MessageContent
                  userId={userData.id}
                  message={message}
                  handleScrollToReply={() => {
                    handleScrollToReply(message.reply_to_id);
                  }}
                  handleMessagePayload={() => {
                    return handleMessagePayload("media", message, userData.id);
                  }}
                />

                {/* Sender Info */}
                <MessageSenderInfo
                  userId={userData.id}
                  senderId={message.sender.id}
                  senderName={message.sender.username}
                  senderAvatar={message.sender.profile_image}
                  messageStatus={message.status}
                  messageUpdate={message.updated_at}
                />
              </div>

              {/* Dropdown Menu For One Message */}
              <div className="opacity-0 group-hover:opacity-[1] group-active:opacity-[1] my-transition">
                <MyDropdown
                  side="bottom"
                  align="center"
                  list={handleMessagePayload(
                    message.content ? "text" : "media",
                    message,
                    userData.id,
                  )}
                />
              </div>
            </li>
          )}
        </React.Fragment>
      ))}

      {/* Scroll To Down Button */}
      {!isAtBottom && (
        <ScrollToDown
          count={newMessageCount}
          onClick={() => {
            if (messagesContainerRef.current) {
              messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth",
              });

              setNewMessagesCount(0);
            }
          }}
        />
      )}
    </div>
  );
}

export default UserChatBody;
