"use client";

// *********************** Logic Imports ***********************
// => My Custom Hooks
import { useSonner } from "../useSonner";
import { useAxiosError } from "../useAxiosError";
import { useLoadingError } from "../useLoadingError";

// => Libraries
import { FieldValues, UseFormReturn } from "react-hook-form";
import axios from "axios";

// **************** My Custom Types & Variables ****************
// => Types & Interfaces
type Values = {
  friendName: string;
  friendPhone: string;
};
interface AddFriendFunc<T extends FieldValues> {
  url: string;
  values: Values;
  form: UseFormReturn<T>;
}
interface UseAddFriendReturn {
  isLoading: boolean;
  addFriendFetchFunc: <T extends FieldValues>(
    config: AddFriendFunc<T>,
  ) => Promise<void>;
}

export function useAddFriend(): UseAddFriendReturn {
  // ******************* Inside Hook  *******************
  // => Use Hooks
  const { showToast } = useSonner();
  const { handleAxiosError } = useAxiosError();
  const { isLoading, handleIsLoading, reset } = useLoadingError();

  // => Functions
  const addFriendFetchFunc = async <T extends FieldValues>(
    config: AddFriendFunc<T>,
  ) => {
    reset();

    try {
      handleIsLoading(true);

      const response = await axios.post(`/${config.url}`, config.values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = response.data;

      // Add Friend Successfully
      if (result.success) {
        showToast({ type: "success", message: result.message });

        // Reset All Values;
        config.form.reset();
      }
    } catch (error: unknown) {
      // Errors Mix Between Try Errors & Catch Errors In Api Route
      handleAxiosError({ error, form: config.form });
    } finally {
      handleIsLoading(false);
    }
  };

  return { isLoading, addFriendFetchFunc };
}
