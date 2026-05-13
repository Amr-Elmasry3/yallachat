"use client";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useSonner } from "../useSonner";
import { useAxiosError } from "../useAxiosError";
import { useLoadingError } from "../useLoadingError";

// => Libraries
import axios from "axios";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
interface RemoveFriendFunc {
  url: string;
  friendId: string | undefined;
  conversationId: number | undefined | null;
}
interface UseRemoveFriendReturn {
  isLoading: boolean;
  removeFriendFetchFunc: (config: RemoveFriendFunc) => Promise<void>;
}

export function useRemoveFriend(): UseRemoveFriendReturn {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { showToast } = useSonner();
  const { handleAxiosError } = useAxiosError();
  const { isLoading, handleIsLoading, reset } = useLoadingError();

  // => Functions
  const removeFriendFetchFunc = async (config: RemoveFriendFunc) => {
    reset();

    try {
      handleIsLoading(true);

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/${config.url}`,
        {
          params: {
            friendId: config.friendId,
            conversationId: config.conversationId,
          },
        },
      );
      const result = response.data;

      // Remove Friend Successfully
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

  return { isLoading, removeFriendFetchFunc };
}
