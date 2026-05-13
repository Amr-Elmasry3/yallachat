"use client";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useAxiosError } from "../useAxiosError";
import { useLoadingError } from "../useLoadingError";

// => Libraries
import axios from "axios";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { MessageStatusUpdateResponse, MessageStatus } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface UpdateMessageStatusParams {
  status: MessageStatus;
  conversationId?: number;
  userId: string;
}
interface UpdateMessageStatusResponse {
  isLoading: boolean;
  updateMessageStatusFunc: (
    params: UpdateMessageStatusParams,
  ) => Promise<MessageStatusUpdateResponse | void>;
}

export function useUpdateMessageStatus(): UpdateMessageStatusResponse {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { handleAxiosError } = useAxiosError();
  const { isLoading, handleIsLoading, reset } = useLoadingError();

  // => Functions
  const updateMessageStatusFunc = async (
    params: UpdateMessageStatusParams,
  ): Promise<MessageStatusUpdateResponse | void> => {
    reset();

    try {
      handleIsLoading(true);

      const response = await axios.patch("/api/messages/status", params, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = response.data;

      // Update Message Status Successfully
      if (result.success) {
        return result;
      }
    } catch (error: unknown) {
      handleAxiosError({ error });
    } finally {
      handleIsLoading(false);
    }
  };

  return { isLoading, updateMessageStatusFunc };
}
