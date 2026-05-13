"use client";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useAxiosError } from "../useAxiosError";
import { useLoadingError } from "../useLoadingError";

/// => Libraries
import axios from "axios";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { CallBody } from "@/components/ui/userChat/headr/phone_call/types";
import { ConversationId } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface SendCallFunc {
  url: string;
  body: CallBody;
  amICaller: boolean;
  conversationId: ConversationId;
}
interface UseSendCallReturn {
  isLoading: boolean;
  sendCallFetchFunc: (config: SendCallFunc) => Promise<void>;
}

export function useSendCall(): UseSendCallReturn {
  // ******************* Inside Hook  *******************
  // => Use Hooks
  const { handleAxiosError } = useAxiosError();
  const { isLoading, handleIsLoading, reset } = useLoadingError();

  // => Functions
  const sendCallFetchFunc = async (config: SendCallFunc) => {
    if (!config.amICaller || !config.conversationId) return;
    reset();

    try {
      handleIsLoading(true);

      await axios.post(`/${config.url}`, config.body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error: unknown) {
      // Errors Mix Between Try Errors & Catch Errors In Api Route
      handleAxiosError({ error });
    } finally {
      handleIsLoading(false);
    }
  };

  return { isLoading, sendCallFetchFunc };
}
