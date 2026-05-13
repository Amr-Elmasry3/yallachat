"use client";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useSonner } from "../useSonner";
import { useAxiosError } from "../useAxiosError";
import { useLoadingError } from "../useLoadingError";

// => Libraries
import axios from "axios";

// ***************** Types & Variables Imports *****************
// => Types & Interfaces
import { UrlFile, FileData } from "@/lib/types";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
type Values = {
  conversationId: number | null;
  senderId: string;
  content: string | null;
  replyToId: number | null;
  type: string;
  mediaUrls: UrlFile[];
  fileData: FileData[];
};
interface SendMessageFunc {
  url: string;
  values: Values;
}
interface UseSendReturn {
  isLoading: boolean;
  sendMessagsFetchFunc: (config: SendMessageFunc) => Promise<void>;
}

export function useSend(): UseSendReturn {
  // ******************* Inside Hook *******************
  // => Use Hooks
  const { showToast } = useSonner();
  const { handleAxiosError } = useAxiosError();
  const { isLoading, handleIsLoading, reset } = useLoadingError();

  // => Functions
  const sendMessagsFetchFunc = async (config: SendMessageFunc) => {
    reset();

    try {
      handleIsLoading(true);

      const response = await axios.post(`/${config.url}`, config.values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = response.data;

      // Send Message Successfully
      if (result.success) {
        showToast({ type: "success", message: result.message });
      }
    } catch (error: unknown) {
      // Errors Mix Between Try Errors & Catch Errors In Api Route
      handleAxiosError({ error });
    } finally {
      handleIsLoading(false);
    }
  };

  return { isLoading, sendMessagsFetchFunc };
}
