"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useCallback } from "react";

// => My Custom Hooks
import { useSupabaseChannel } from "@/hooks/useSupbaseChannel";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { PostgresChangePayload, LastMessage } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseFriendsSubscriptionProps {
  friendIds: string;
  conversationIds: string;
  userId: string | null;
  enabled: boolean;
  onStatusUpdate: (friendId: string, status: string, lastSeen: string) => void;
  onMessageInsert: (message: LastMessage, userId: string | null) => void;
  onMessageUpdate: (message: LastMessage, userId: string | null) => void;
}

export const useFriendsSubscription = ({
  friendIds,
  conversationIds,
  userId,
  enabled,
  onStatusUpdate,
  onMessageInsert,
  onMessageUpdate,
}: UseFriendsSubscriptionProps) => {
  // ******************* Inside The Component  *******************
  // => Functions
  // Handle status update from users table
  const handleUserUpdate = useCallback(
    (payload: Record<string, unknown>) => {
      onStatusUpdate(
        payload.id as string,
        payload.status as string,
        payload.last_seen as string,
      );
    },
    [onStatusUpdate],
  );

  // Handle Message Events
  const handleMessageEvent = useCallback(
    (payload: PostgresChangePayload) => {
      const message = payload.new as LastMessage;
      const eventType = payload.eventType;

      if (eventType === "INSERT") {
        onMessageInsert(message, userId);
      } else if (eventType === "UPDATE") {
        onMessageUpdate(message, userId);
      }
    },
    [userId, onMessageInsert, onMessageUpdate],
  );

  // Subscribe To Users Table (Status Updates)
  useSupabaseChannel({
    channelName: "users-status",
    events: [
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
        filter: `id=in.(${friendIds})`,
        callback: (payload) => handleUserUpdate(payload.new),
      },
    ],
    enabled: enabled && friendIds.length > 0,
  });

  // Subscribe To Messages Table
  useSupabaseChannel({
    channelName: "friends-unread",
    events: [
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: conversationIds
          ? `conversation_id=in.(${conversationIds})`
          : undefined,
        callback: handleMessageEvent,
      },
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: conversationIds
          ? `conversation_id=in.(${conversationIds})`
          : undefined,
        callback: handleMessageEvent,
      },
    ],
    enabled: enabled && !!userId && conversationIds.length > 0,
  });
};
