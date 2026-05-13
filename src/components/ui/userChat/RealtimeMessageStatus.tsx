"use client";

// *********************** Logic Imports ***********************
// => Ready To Use Hooks
import { useEffect, useRef, useState, useCallback } from "react";

// => My Custom Hooks
import { useUser } from "@/hooks/user/useUser";
import { useUpdateMessageStatus } from "@/hooks/messages/useUpdateMessageStatus";
import { useSupabaseChannel } from "@/hooks/useSupbaseChannel";

// => Libs & Utils
import { supabaseClient } from "@/lib/supabase/client";

export function RealtimeMessageStatus() {
  // ******************* Inside The Component  *******************
  // => States & Refs
  const [userId, setUserId] = useState<string | null>(null);
  const hasCheckedRef = useRef(false);

  // => Use Hooks
  const { userIdFetchFunc } = useUser();
  const { updateMessageStatusFunc } = useUpdateMessageStatus();

  // => Use Effects
  // --- Get User Id On Component Mount ---
  useEffect(() => {
    const fetchUserId = async () => {
      const user = await userIdFetchFunc("api/user/userId");
      if (user?.id) {
        setUserId(user.id);
      }
    };

    fetchUserId();
  }, [userIdFetchFunc]);

  // --- Update Sent Messages To Delivered On Initial Load ---
  useEffect(() => {
    if (!userId || hasCheckedRef.current) return;

    const updateSentMessagesToDelivered = async () => {
      try {
        // First, Fetch Messages With Status "Sent" For This User (Messages Not Sent By Them)
        const { data: sentMessages, error: fetchError } = await supabaseClient
          .from("messages")
          .select("id")
          .eq("status", "sent")
          .neq("sender_id", userId);

        if (fetchError) return;

        // If There Are Sent Messages, Update Them To Delivered
        if (sentMessages && sentMessages.length > 0) {
          await updateMessageStatusFunc({
            status: "delivered",
            userId: userId,
          });
        }
      } catch (error) {
        console.error("Error updating messages to delivered:", error);
      } finally {
        hasCheckedRef.current = true;
      }
    };

    updateSentMessagesToDelivered();
  }, [userId, updateMessageStatusFunc]);

  // => Functions
  // --- Handle New Incoming Messages ---
  const handleNewMessage = useCallback(
    async (payload: {
      new: Record<string, unknown>;
      old: Record<string, unknown>;
      errors: null;
    }) => {
      const newMessage = payload.new;

      // If New Message Status Is "Sent", Mark As Delivered
      if (newMessage.status === "sent") {
        await updateMessageStatusFunc({
          status: "delivered",
          userId: userId!,
        });
      }
    },
    [userId, updateMessageStatusFunc],
  );

  // --- Subscribe To New Messages And Mark Them As Delivered ---
  useSupabaseChannel({
    channelName: "realtime-message-status",
    events: [
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `sender_id=neq.${userId}`, // Only Messages NOT From Current User
        callback: handleNewMessage,
      },
    ],
    enabled: !!userId,
  });

  // No UI - This Is A Background Service Component
  return null;
}
