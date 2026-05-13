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
interface RemoveMessageFunc {
  url: string;
}
interface UseRemoveMessageReturn {
  isLoading: boolean;
  removeMessageFetchFunc: (config: RemoveMessageFunc) => Promise<void>;
}

export function useRemoveMessage(): UseRemoveMessageReturn {
  // ******************* Inside The Component  *******************
  // => Use Hooks
  const { showToast } = useSonner();
  const { handleAxiosError } = useAxiosError();
  const { isLoading, handleIsLoading, reset } = useLoadingError();

  // => Functions
  const removeMessageFetchFunc = async (config: RemoveMessageFunc) => {
    reset();

    try {
      handleIsLoading(true);

      const response = await axios.delete(`/${config.url}`);

      const result = response.data;

      // Remove Message Successfully
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

  return { isLoading, removeMessageFetchFunc };
}
