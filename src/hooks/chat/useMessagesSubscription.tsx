"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useCallback } from "react";

// => My Custom Hooks
import { useSupabaseChannel } from "@/hooks/useSupbaseChannel";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import {
  Message,
  PostgresChangePayload,
  UserInfo,
  ConversationId,
} from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseMessagesSubscriptionProps {
  conversationId: ConversationId;
  userDataRef: React.RefObject<UserInfo>;
  friendDataRef: React.RefObject<UserInfo>;
  handleMessages: (update: (prev: Message[]) => Message[]) => void;
  onNewMessagesFromFriend?: () => void;
  handleNewMessageCount: (count: number) => void;
}

export function useMessagesSubscription({
  conversationId,
  userDataRef,
  friendDataRef,
  handleMessages,
  onNewMessagesFromFriend,
  handleNewMessageCount,
}: UseMessagesSubscriptionProps) {
  // ******************* Inside Hook *******************
  // => Functions
  // Function For Message Event => INSERT
  const handleMessageInsert = useCallback(
    (payload: PostgresChangePayload) => {
      const payloadMessage = payload.new as Message;

      let sender: UserInfo;

      if (
        payloadMessage.sender_id === userDataRef.current?.id &&
        userDataRef.current?.id
      ) {
        sender = userDataRef.current;
      } else {
        sender = friendDataRef.current;

        handleNewMessageCount(1);
      }

      const newMessage: Message = {
        ...payloadMessage,
        sender,
      };

      handleMessages((prevMessages: Message[]) => [
        ...prevMessages,
        newMessage,
      ]);

      if (
        payloadMessage.sender_id !== userDataRef.current?.id &&
        onNewMessagesFromFriend
      ) {
        setTimeout(() => {
          onNewMessagesFromFriend();
        }, 100);
      }
    },
    [
      handleMessages,
      onNewMessagesFromFriend,
      userDataRef,
      friendDataRef,
      handleNewMessageCount,
    ],
  );

  // Function For Message Event => UPDATE
  const handleMessageUpdate = useCallback(
    (payload: PostgresChangePayload) => {
      handleMessages((prevMessages: Message[]) =>
        prevMessages.map((message: Message) => {
          if (message.id === (payload.new.id as number)) {
            return {
              ...message,
              ...(payload.new as Partial<Message>),
            };
          }
          return message;
        }),
      );
    },
    [handleMessages],
  );

  // Function For Message Event => DELETE
  const handleMessageDelete = useCallback(
    (payload: PostgresChangePayload) => {
      handleMessages((prevMessages: Message[]) =>
        prevMessages.filter(
          (message: Message) => message.id !== (payload.old.id as number),
        ),
      );
    },
    [handleMessages],
  );

  // Setup Supabase Real Time For Messages Table
  useSupabaseChannel({
    channelName: `messages-${conversationId}`,
    events: [
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
        callback: handleMessageInsert,
      },
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
        callback: handleMessageUpdate,
      },
      {
        event: "DELETE",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
        callback: handleMessageDelete,
      },
    ],
    enabled: !!conversationId,
  });
}
