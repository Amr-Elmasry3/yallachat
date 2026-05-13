"use client";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useSendCall } from "./useSendCall";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { CallBody } from "@/components/ui/userChat/headr/phone_call/types";
import { ConversationId } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UseCallRecordingReturn {
  saveCallRecord: (
    data: Omit<CallBody, "callerId" | "receiverId" | "conversationId">,
    amICaller: boolean,
  ) => void;
}

export function useCallRecording(
  myId: string | undefined,
  friendId: string | undefined,
  conversationId: ConversationId | undefined,
): UseCallRecordingReturn {
  // ******************* Inside Hook  *******************
  // => Use Hooks
  const { sendCallFetchFunc } = useSendCall();

  // => Functions
  const saveCallRecord = (
    data: Omit<CallBody, "callerId" | "receiverId" | "conversationId">,
    amICaller: boolean,
  ) => {
    if (!myId || !friendId || !conversationId) return;

    const body: CallBody = {
      callerId: myId,
      receiverId: friendId,
      conversationId: conversationId,
      ...data,
    };

    // Fetch Code
    sendCallFetchFunc({ url: "api/calls", body, amICaller, conversationId });
  };

  return { saveCallRecord };
}
